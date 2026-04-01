import { Router } from 'express';
import Notification from '../models/Notification';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/v1/notifications
router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ user: req.user!._id }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Notification.countDocuments({ user: req.user!._id }),
      Notification.countDocuments({ user: req.user!._id, isRead: false }),
    ]);

    sendSuccess(res, { notifications, unreadCount }, 'Notifications fetched', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  })
);

// PUT /api/v1/notifications/:id/read
router.put(
  '/:id/read',
  authenticate,
  asyncHandler(async (req, res) => {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      { isRead: true }
    );
    sendSuccess(res, null, 'Marked as read');
  })
);

// PUT /api/v1/notifications/read-all
router.put(
  '/read-all',
  authenticate,
  asyncHandler(async (req, res) => {
    await Notification.updateMany({ user: req.user!._id, isRead: false }, { isRead: true });
    sendSuccess(res, null, 'All marked as read');
  })
);

export default router;
