import { Router } from 'express';
import Category from '../models/Category';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { createCategorySchema, updateCategorySchema } from '../validators/product';
import { createAuditLog } from '../services/auditService';
import { cacheGet, cacheSet, cacheDelPattern } from '../config/redis';

const router = Router();

const slugify = (text: string): string =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/v1/categories
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const cached = await cacheGet('categories:all');
    if (cached) {
      sendSuccess(res, JSON.parse(cached));
      return;
    }

    const categories = await Category.find({ isDeleted: false, isActive: true })
      .populate('parent', 'name slug')
      .sort({ sortOrder: 1, name: 1 });

    await cacheSet('categories:all', JSON.stringify(categories), 1800);
    sendSuccess(res, categories);
  })
);

// GET /api/v1/categories/:slug
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const category = await Category.findOne({ slug: req.params.slug, isDeleted: false })
      .populate('parent', 'name slug');
    if (!category) throw new NotFoundError('Category not found');
    sendSuccess(res, category);
  })
);

// POST /api/v1/categories (admin)
router.post(
  '/',
  authenticate,
  authorize('super_admin'),
  validate(createCategorySchema),
  asyncHandler(async (req, res) => {
    const slug = slugify(req.body.name);
    const existing = await Category.findOne({ slug, isDeleted: false });
    if (existing) throw new BadRequestError('Category with this name already exists');

    const category = await Category.create({ ...req.body, slug });
    await cacheDelPattern('categories:*');
    await createAuditLog(req, 'CREATE_CATEGORY', 'Category', category._id.toString());
    sendSuccess(res, category, 'Category created', 201);
  })
);

// PUT /api/v1/categories/:id (admin)
router.put(
  '/:id',
  authenticate,
  authorize('super_admin'),
  validate(updateCategorySchema),
  asyncHandler(async (req, res) => {
    const updateData = { ...req.body };
    if (req.body.name) {
      updateData.slug = slugify(req.body.name);
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!category) throw new NotFoundError('Category not found');

    await cacheDelPattern('categories:*');
    await createAuditLog(req, 'UPDATE_CATEGORY', 'Category', req.params.id);
    sendSuccess(res, category, 'Category updated');
  })
);

// DELETE /api/v1/categories/:id (admin, soft delete)
router.delete(
  '/:id',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!category) throw new NotFoundError('Category not found');

    await cacheDelPattern('categories:*');
    await createAuditLog(req, 'DELETE_CATEGORY', 'Category', req.params.id);
    sendSuccess(res, null, 'Category deleted');
  })
);

export default router;
