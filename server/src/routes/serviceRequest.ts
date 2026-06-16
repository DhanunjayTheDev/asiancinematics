import { Router } from 'express';
import ServiceRequest from '../models/ServiceRequest';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import { NotFoundError } from '../utils/errors';
import { validate } from '../middleware/validate';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { z } from 'zod';

const router = Router();

const createSchema = z.object({
  body: z.object({
    formType: z.string().default('security'),
    name: z.string().min(1, 'Name is required'),
    contact: z.string().min(1, 'Contact is required'),
    state: z.string().optional(),
    district: z.string().optional(),
    address: z.string().optional(),
    categories: z.array(z.string()).optional(),
    systemType: z.string().optional(),
    serviceRequestType: z.string().optional(),
    serviceAmount: z.number().optional(),
    startDate: z.string().optional(),
    specs: z.string().optional(),
    needsDiscussion: z.boolean().optional(),
    // legacy
    product: z.string().optional(),
    location: z.string().optional(),
    timeline: z.string().optional(),
    reference: z.string().optional(),
    brand: z.string().optional(),
    budget: z.string().optional(),
  }),
});

// POST /api/v1/service-requests
router.post(
  '/',
  optionalAuth,
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const data: any = { ...req.body };
    if (req.user) data.user = req.user._id;
    if (data.startDate) data.startDate = new Date(data.startDate);
    const sr = await ServiceRequest.create(data);
    sendSuccess(res, sr, 'Service request submitted', 201);
  })
);

// POST /api/v1/service-requests/:id/payment submit UTR + screenshot
router.post(
  '/:id/payment',
  optionalAuth,
  upload.single('paymentScreenshot'),
  asyncHandler(async (req, res) => {
    const { utrNumber } = req.body;
    const sr = await ServiceRequest.findById(req.params.id);
    if (!sr || sr.isDeleted) throw new NotFoundError('Service request not found');

    sr.utrNumber = utrNumber;
    if (req.file) {
      sr.paymentScreenshot = `/uploads/${req.file.filename}`;
    }
    sr.paymentStatus = 'submitted';
    await sr.save();
    sendSuccess(res, sr, 'Payment details submitted');
  })
);

// GET /api/v1/service-requests/all (admin)
router.get(
  '/all',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;
    const paymentStatus = req.query.paymentStatus as string;
    const formType = req.query.formType as string;

    const filter: Record<string, unknown> = { isDeleted: false };
    if (status && status !== 'all') filter.status = status;
    if (paymentStatus && paymentStatus !== 'all') filter.paymentStatus = paymentStatus;
    if (formType && formType !== 'all') filter.formType = formType;

    const [requests, total] = await Promise.all([
      ServiceRequest.find(filter)
        .populate('user', 'name email phone')
        .populate('assignedTo', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      ServiceRequest.countDocuments(filter),
    ]);

    sendPaginated(res, requests, total, page, limit);
  })
);

// GET /api/v1/service-requests/:id (admin)
router.get(
  '/:id',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name');
    if (!request || request.isDeleted) throw new NotFoundError('Service request not found');
    sendSuccess(res, request);
  })
);

// PUT /api/v1/service-requests/:id/status
router.put(
  '/:id/status',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const { status, notes, assignedTo, paymentStatus } = req.body;
    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (notes) updateData.notes = notes;
    if (assignedTo) updateData.assignedTo = assignedTo;

    const request = await ServiceRequest.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name');
    if (!request) throw new NotFoundError('Service request not found');
    sendSuccess(res, request, 'Service request updated');
  })
);

export default router;
