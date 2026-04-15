import { Router } from 'express';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Order from '../models/Order';
import Product from '../models/Product';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { createOrderSchema, updateOrderStatusSchema, assignOrderSchema } from '../validators/order';
import { createAuditLog } from '../services/auditService';
import { createNotification } from '../services/notificationService';
import { sendOrderConfirmationEmail, sendStatusUpdateEmail } from '../services/emailService';
import User from '../models/User';

const router = Router();

const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().slice(0, 4).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// POST /api/v1/orders
router.post(
  '/',
  authenticate,
  validate(createOrderSchema),
  asyncHandler(async (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.product).session(session);
        if (!product || product.isDeleted || !product.isActive) {
          throw new BadRequestError(`Product not found: ${item.product}`);
        }
        if (product.stock < item.quantity) {
          throw new BadRequestError(`Insufficient stock for: ${product.name}. Available: ${product.stock}`);
        }

        product.stock -= item.quantity;
        await product.save({ session });

        subtotal += product.price * item.quantity;
        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.images[0],
        });
      }

      const tax = Math.round(subtotal * 0.18 * 100) / 100;
      const shippingCost = subtotal > 999 ? 0 : 99;
      const totalAmount = subtotal + tax + shippingCost;

      const order = await Order.create(
        [
          {
            orderNumber: generateOrderNumber(),
            user: req.user!._id,
            items: orderItems,
            shippingAddress,
            subtotal,
            shippingCost,
            tax,
            totalAmount,
            paymentMethod,
            paymentStatus: paymentMethod === 'COD' ? 'pending' : 'pending',
          },
        ],
        { session }
      );

      await session.commitTransaction();

      const user = await User.findById(req.user!._id);
      if (user) {
        await sendOrderConfirmationEmail(user.email, order[0].orderNumber, totalAmount);
      }

      await createNotification(
        req.user!._id,
        'Order Placed',
        `Your order ${order[0].orderNumber} has been placed successfully`,
        'order',
        'in_app',
        'Order',
        order[0]._id.toString()
      );

      sendSuccess(res, order[0], 'Order placed successfully', 201);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  })
);

// GET /api/v1/orders (customer: own orders)
router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;

    const filter: Record<string, unknown> = { user: req.user!._id, isDeleted: false };
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      Order.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Order.countDocuments(filter),
    ]);

    sendPaginated(res, orders, total, page, limit);
  })
);

// GET /api/v1/orders/all (admin)
router.get(
  '/all',
  authenticate,
  authorize('super_admin', 'employee'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const filter: Record<string, unknown> = { isDeleted: false };
    if (status) filter.status = status;
    if (search) filter.orderNumber = { $regex: search, $options: 'i' };

    const [orders, total] = await Promise.all([
      Order.find(filter).populate('user', 'name email phone').populate('assignedTo', 'name').skip(skip).limit(limit).sort({ createdAt: -1 }),
      Order.countDocuments(filter),
    ]);

    sendPaginated(res, orders, total, page, limit);
  })
);

// GET /api/v1/orders/:id
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = { _id: req.params.id, isDeleted: false };
    if (!['super_admin', 'employee'].includes(req.user!.role)) {
      filter.user = req.user!._id;
    }

    const order = await Order.findOne(filter)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name')
      .populate('items.product', 'name slug');
    if (!order) throw new NotFoundError('Order not found');
    sendSuccess(res, order);
  })
);

// PUT /api/v1/orders/:id/status (admin)
router.put(
  '/:id/status',
  authenticate,
  authorize('super_admin', 'employee'),
  validate(updateOrderStatusSchema),
  asyncHandler(async (req, res) => {
    const { status, notes, cancelReason } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order || order.isDeleted) throw new NotFoundError('Order not found');

    // Production-grade status transition validation
    const allowedTransitions: Record<string, string[]> = {
      pending:    ['confirmed', 'processing', 'cancelled'],
      confirmed:  ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped:    ['delivered'],
      delivered:  [], // terminal state
      cancelled:  [], // terminal state
    };

    const allowed = allowedTransitions[order.status] || [];
    if (!allowed.includes(status)) {
      throw new BadRequestError(
        `Cannot transition from "${order.status}" to "${status}". Allowed: ${allowed.join(', ') || 'none (terminal state)'}`
      );
    }

    // Restore stock on cancellation
    if (status === 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
      if (order.paymentStatus === 'paid') {
        order.paymentStatus = 'refunded';
      }
    }

    order.status = status;
    if (notes) order.notes = notes;
    if (cancelReason) order.cancelReason = cancelReason;

    // Auto-mark COD as paid on delivery
    if (status === 'delivered' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    const user = await User.findById(order.user);
    if (user) {
      await sendStatusUpdateEmail(user.email, 'Order', order.orderNumber, status);
    }

    await createNotification(order.user.toString(), 'Order Update', `Order ${order.orderNumber} is now ${status}`, 'order', 'in_app', 'Order', order._id.toString());
    await createAuditLog(req, 'UPDATE_ORDER_STATUS', 'Order', req.params.id, { status });
    sendSuccess(res, order, 'Order status updated');
  })
);

// PUT /api/v1/orders/:id/cancel (customer)
router.put(
  '/:id/cancel',
  authenticate,
  asyncHandler(async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id, user: req.user!._id, isDeleted: false });
    if (!order) throw new NotFoundError('Order not found');

    if (!['pending', 'confirmed'].includes(order.status)) {
      throw new BadRequestError('Can only cancel pending or confirmed orders');
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    order.status = 'cancelled';
    order.cancelReason = req.body.reason || 'Cancelled by customer';
    await order.save();

    sendSuccess(res, order, 'Order cancelled');
  })
);

// PUT /api/v1/orders/:id/assign (admin)
router.put(
  '/:id/assign',
  authenticate,
  authorize('super_admin'),
  validate(assignOrderSchema),
  asyncHandler(async (req, res) => {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.assignedTo },
      { new: true }
    ).populate('assignedTo', 'name');
    if (!order) throw new NotFoundError('Order not found');

    await createNotification(req.body.assignedTo, 'Order Assigned', `Order ${order.orderNumber} has been assigned to you`, 'assignment', 'in_app', 'Order', order._id.toString());
    await createAuditLog(req, 'ASSIGN_ORDER', 'Order', req.params.id, { assignedTo: req.body.assignedTo });
    sendSuccess(res, order, 'Order assigned');
  })
);

export default router;
