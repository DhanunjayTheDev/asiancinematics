import { Router } from 'express';
import Order from '../models/Order';
import ServiceTicket from '../models/ServiceTicket';
import SiteVisit from '../models/SiteVisit';
import Inquiry from '../models/Inquiry';
import User from '../models/User';
import AuditLog from '../models/AuditLog';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import { authenticate, authorize } from '../middleware/auth';
import { Parser } from '@json2csv/plainjs';

const router = Router();

// GET /api/v1/admin/dashboard
router.get(
  '/dashboard',
  authenticate,
  authorize('super_admin', 'support', 'employee'),
  asyncHandler(async (_req, res) => {
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      openTickets,
      pendingVisits,
      newInquiries,
      totalUsers,
      totalCustomers,
      ordersByStatus,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments({ isDeleted: false }),
      Order.countDocuments({ status: 'pending', isDeleted: false }),
      Order.countDocuments({ status: 'confirmed', isDeleted: false }),
      Order.countDocuments({ status: 'processing', isDeleted: false }),
      Order.countDocuments({ status: 'shipped', isDeleted: false }),
      Order.countDocuments({ status: 'delivered', isDeleted: false }),
      Order.countDocuments({ status: 'cancelled', isDeleted: false }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' }, isDeleted: false } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      ServiceTicket.countDocuments({ status: { $in: ['open', 'in_progress'] }, isDeleted: false }),
      SiteVisit.countDocuments({ status: 'scheduled', isDeleted: false }),
      Inquiry.countDocuments({ status: 'new', isDeleted: false }),
      User.countDocuments({ isDeleted: false }),
      User.countDocuments({ role: 'customer', isDeleted: false }),
      Order.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Order.find({ isDeleted: false })
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    const revenueByMonth = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, isDeleted: false } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    const monthlyRevenue = revenueByMonth.map((m: any) => ({
      month: m._id,
      revenue: m.revenue,
      orders: m.count,
    }));

    sendSuccess(res, {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      openTickets,
      pendingVisits,
      newInquiries,
      totalUsers,
      totalCustomers,
      ordersByStatus,
      monthlyRevenue,
      recentOrders,
    });
  })
);

// GET /api/v1/admin/audit-logs
router.get(
  '/audit-logs',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;
    const resource = req.query.resource as string;
    const action = req.query.action as string;

    const filter: Record<string, unknown> = {};
    if (resource) filter.resource = resource;
    if (action) filter.action = action;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate('user', 'name email role')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      AuditLog.countDocuments(filter),
    ]);

    sendPaginated(res, logs, total, page, limit);
  })
);

// GET /api/v1/admin/reports/orders
router.get(
  '/reports/orders',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      isDeleted: false,
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    sendSuccess(res, orders);
  })
);

// GET /api/v1/admin/reports/orders/export
router.get(
  '/reports/orders/export',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      isDeleted: false,
    })
      .populate('user', 'name email phone')
      .lean();

    const data = orders.map((o: any) => ({
      OrderNumber: o.orderNumber,
      Customer: o.user?.name || 'N/A',
      Email: o.user?.email || 'N/A',
      Status: o.status,
      PaymentMethod: o.paymentMethod,
      PaymentStatus: o.paymentStatus,
      Total: o.totalAmount,
      Date: new Date(o.createdAt).toISOString().split('T')[0],
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=orders-report-${Date.now()}.csv`);
    res.send(csv);
  })
);

// GET /api/v1/admin/freelancer/tasks (freelancer)
router.get(
  '/freelancer/tasks',
  authenticate,
  authorize('freelancer'),
  asyncHandler(async (req, res) => {
    const [orders, tickets, siteVisits] = await Promise.all([
      Order.find({ assignedTo: req.user!._id, isDeleted: false }).sort({ createdAt: -1 }),
      ServiceTicket.find({ assignedTo: req.user!._id, isDeleted: false }).sort({ createdAt: -1 }),
      SiteVisit.find({ assignedTo: req.user!._id, isDeleted: false }).populate('user', 'name phone email').sort({ date: -1 }),
    ]);

    sendSuccess(res, { orders, tickets, siteVisits });
  })
);

// PUT /api/v1/admin/freelancer/tasks/:id/accept
router.put(
  '/freelancer/tasks/:id/accept',
  authenticate,
  authorize('freelancer'),
  asyncHandler(async (req, res) => {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user!._id },
      { status: 'processing' },
      { new: true }
    );
    if (order) {
      sendSuccess(res, order, 'Task accepted');
      return;
    }

    const ticket = await ServiceTicket.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user!._id },
      { status: 'in_progress' },
      { new: true }
    );
    if (!ticket) {
      sendSuccess(res, null, 'Task not found', 404);
      return;
    }
    sendSuccess(res, ticket, 'Task accepted');
  })
);

// PUT /api/v1/admin/freelancer/tasks/:id/complete
router.put(
  '/freelancer/tasks/:id/complete',
  authenticate,
  authorize('freelancer'),
  asyncHandler(async (req, res) => {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user!._id },
      { status: 'delivered' },
      { new: true }
    );
    if (order) {
      sendSuccess(res, order, 'Task completed');
      return;
    }

    const ticket = await ServiceTicket.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user!._id },
      { status: 'resolved' },
      { new: true }
    );
    if (!ticket) {
      sendSuccess(res, null, 'Task not found', 404);
      return;
    }
    sendSuccess(res, ticket, 'Task completed');
  })
);

export default router;
