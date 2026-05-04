import { Router } from 'express';
import ServiceRequest from '../models/ServiceRequest';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import { NotFoundError } from '../utils/errors';
import { validate } from '../middleware/validate';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const createServiceRequestSchema = z.object({
  product: z.string().min(1),
  name: z.string().min(1),
  location: z.string().min(1),
  timeline: z.string().optional(),
  reference: z.string().optional(),
  brand: z.string().optional(),
  budget: z.string().optional(),
  roomSize: z.string().optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  dedicatedHT: z.string().optional(),
  livingRoomHT: z.string().optional(),
  towers: z.string().optional(),
  inwalls: z.string().optional(),
  inceilings: z.string().optional(),
  onwalls: z.string().optional(),
  needAtmos: z.string().optional(),
  setupType: z.string().optional(),
  projector: z.string().optional(),
  tv: z.string().optional(),
  preferredBrands: z.string().optional(),
  targetBudget: z.string().optional(),
  duration: z.string().optional(),
});

// POST /api/v1/service-requests
router.post(
  '/',
  optionalAuth,
  validate(createServiceRequestSchema),
  asyncHandler(async (req, res) => {
    const data = { ...req.body };
    if (req.user) data.user = req.user._id;

    const serviceRequest = await ServiceRequest.create(data);
    sendSuccess(res, serviceRequest, 'Service request submitted', 201);
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

    const filter: Record<string, unknown> = { isDeleted: false };
    if (status) filter.status = status;

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
    const { status, notes, assignedTo } = req.body;
    const updateData: Record<string, unknown> = { status };
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
