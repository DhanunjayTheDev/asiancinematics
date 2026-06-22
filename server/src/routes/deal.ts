import { Router } from 'express';
import Deal from '../models/Deal';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { authenticate, authorize } from '../middleware/auth';
import { createAuditLog } from '../services/auditService';

const router = Router();

// GET /api/v1/deals public, active deals only
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const deals = await Deal.find({ isActive: true, isDeleted: false })
      .populate('products', 'name slug price images')
      .sort({ createdAt: -1 });
    sendSuccess(res, deals);
  })
);

// GET /api/v1/deals/:id public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const deal = await Deal.findOne({ _id: req.params.id, isDeleted: false })
      .populate('products', 'name slug price images');
    if (!deal) throw new NotFoundError('Deal not found');
    sendSuccess(res, deal);
  })
);

// POST /api/v1/deals admin only
router.post(
  '/',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const { type, name, description, products, isActive, startDate, endDate } = req.body;
    if (!type || !name) throw new BadRequestError('type and name are required');

    const deal = await Deal.create({ type, name, description, products: products || [], isActive: isActive !== false, startDate, endDate });
    await createAuditLog(req, 'CREATE_DEAL', 'Deal', deal._id.toString());
    sendSuccess(res, deal, 'Deal created', 201);
  })
);

// PUT /api/v1/deals/:id admin only
router.put(
  '/:id',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const { type, name, description, products, isActive, startDate, endDate } = req.body;
    const update: Record<string, unknown> = {};
    if (type !== undefined) update.type = type;
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (products !== undefined) update.products = products;
    if (isActive !== undefined) update.isActive = isActive;
    if (startDate !== undefined) update.startDate = startDate;
    if (endDate !== undefined) update.endDate = endDate;

    const deal = await Deal.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
      .populate('products', 'name slug price images');
    if (!deal) throw new NotFoundError('Deal not found');

    await createAuditLog(req, 'UPDATE_DEAL', 'Deal', req.params.id);
    sendSuccess(res, deal, 'Deal updated');
  })
);

// DELETE /api/v1/deals/:id admin soft delete
router.delete(
  '/:id',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const deal = await Deal.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!deal) throw new NotFoundError('Deal not found');

    await createAuditLog(req, 'DELETE_DEAL', 'Deal', req.params.id);
    sendSuccess(res, null, 'Deal deleted');
  })
);

export default router;
