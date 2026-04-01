import { Router } from 'express';
import Inquiry from '../models/Inquiry';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import { NotFoundError } from '../utils/errors';
import { validate } from '../middleware/validate';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { createInquirySchema } from '../validators/service';
import { createAuditLog } from '../services/auditService';

const router = Router();

// POST /api/v1/inquiries
router.post(
  '/',
  optionalAuth,
  validate(createInquirySchema),
  asyncHandler(async (req, res) => {
    const data = { ...req.body };
    if (req.user) data.user = req.user._id;

    const inquiry = await Inquiry.create(data);
    sendSuccess(res, inquiry, 'Inquiry submitted', 201);
  })
);

// GET /api/v1/inquiries/all (admin)
router.get(
  '/all',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;

    const filter: Record<string, unknown> = { isDeleted: false };
    if (status) filter.status = status;

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter)
        .populate('user', 'name email')
        .populate('assignedTo', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Inquiry.countDocuments(filter),
    ]);

    sendPaginated(res, inquiries, total, page, limit);
  })
);

// GET /api/v1/inquiries/:id (admin)
router.get(
  '/:id',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name');
    if (!inquiry || inquiry.isDeleted) throw new NotFoundError('Inquiry not found');
    sendSuccess(res, inquiry);
  })
);

// PUT /api/v1/inquiries/:id/status
router.put(
  '/:id/status',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const { status, notes } = req.body;
    const updateData: Record<string, unknown> = { status };
    if (notes) updateData.notes = notes;

    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!inquiry) throw new NotFoundError('Inquiry not found');

    await createAuditLog(req, 'UPDATE_INQUIRY_STATUS', 'Inquiry', req.params.id, { status });
    sendSuccess(res, inquiry, 'Inquiry updated');
  })
);

// DELETE /api/v1/inquiries/:id
router.delete(
  '/:id',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (!inquiry) throw new NotFoundError('Inquiry not found');
    await createAuditLog(req, 'DELETE_INQUIRY', 'Inquiry', req.params.id);
    sendSuccess(res, null, 'Inquiry deleted');
  })
);

export default router;
