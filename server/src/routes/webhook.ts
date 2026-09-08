import express, { Router } from 'express';
import crypto from 'crypto';
import config from '../config';
import Order from '../models/Order';
import User from '../models/User';
import { createNotification } from '../services/notificationService';
import { sendStatusUpdateEmail } from '../services/emailService';
import { logger } from '../utils/logger';

const router = Router();

// POST /api/v1/webhooks/razorpay
// Raw body required for HMAC signature verification — must not pass through express.json().
router.post('/razorpay', express.raw({ type: 'application/json', limit: '1mb' }), async (req, res) => {
  const signature = req.headers['x-razorpay-signature'] as string | undefined;
  const rawBody = req.body as Buffer;

  if (!config.payment.razorpay.webhookSecret) {
    logger.error('Razorpay webhook: RAZORPAY_WEBHOOK_SECRET not configured');
    return res.status(500).json({ success: false, message: 'Webhook not configured' });
  }

  if (!signature || !Buffer.isBuffer(rawBody) || rawBody.length === 0) {
    return res.status(400).json({ success: false, message: 'Missing signature or body' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', config.payment.razorpay.webhookSecret)
    .update(rawBody)
    .digest('hex');

  const expectedBuf = Buffer.from(expectedSignature, 'hex');
  const receivedBuf = Buffer.from(signature, 'hex');
  const isValid =
    expectedBuf.length === receivedBuf.length && crypto.timingSafeEqual(expectedBuf, receivedBuf);

  if (!isValid) {
    logger.warn('Razorpay webhook: signature mismatch');
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid JSON payload' });
  }

  try {
    const payment = event?.payload?.payment?.entity;

    if ((event.event === 'payment.captured' || event.event === 'order.paid') && payment?.order_id) {
      const order = await Order.findOne({ razorpayOrderId: payment.order_id, isDeleted: false });

      if (order && order.paymentStatus !== 'paid') {
        order.paymentId = payment.id;
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        await order.save();

        const user = await User.findById(order.user);
        if (user) {
          await sendStatusUpdateEmail(user.email, 'Order', order.orderNumber, 'confirmed');
        }
        await createNotification(
          order.user.toString(),
          'Payment Successful',
          `Payment for order ${order.orderNumber} was received. Your order is confirmed.`,
          'order',
          'in_app',
          'Order',
          order._id.toString()
        );
        logger.info(`Razorpay webhook: order ${order.orderNumber} confirmed via ${event.event}`);
      }
    } else if (event.event === 'payment.failed' && payment?.order_id) {
      const order = await Order.findOne({ razorpayOrderId: payment.order_id, isDeleted: false });
      if (order && order.paymentStatus === 'pending') {
        order.paymentStatus = 'failed';
        await order.save();
        logger.info(`Razorpay webhook: order ${order.orderNumber} payment failed`);
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (err) {
    logger.error('Razorpay webhook processing error:', err);
    // Non-2xx so Razorpay retries — the order may not have been updated due to a transient error.
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
});

export default router;
