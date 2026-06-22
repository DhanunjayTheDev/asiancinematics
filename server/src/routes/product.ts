import { Router } from 'express';
import Product from '../models/Product';
import Deal from '../models/Deal';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { createProductSchema, updateProductSchema } from '../validators/product';
import { createAuditLog } from '../services/auditService';
import { cacheGet, cacheSet, cacheDelPattern } from '../config/redis';
import { deleteFromCloudinary, extractPublicId } from '../utils/cloudinary';

const router = Router();

const slugify = (text: string): string =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/v1/products
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;
    const category = req.query.category as string;
    const search = req.query.search as string;
    const sort = req.query.sort as string;
    const featured = req.query.featured as string;
    const minPrice = req.query.minPrice as string;
    const maxPrice = req.query.maxPrice as string;
    const dealId = req.query.deal as string;
    const dealType = req.query.dealType as string;

    const cacheKey = `products:${page}:${limit}:${category || ''}:${search || ''}:${sort || ''}:${featured || ''}:${dealId || ''}:${dealType || ''}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      sendPaginated(res, data.products, data.total, page, limit);
      return;
    }

    const filter: Record<string, unknown> = { isDeleted: false, isActive: true };

    // Filter by specific deal ID
    if (dealId) {
      const deal = await Deal.findOne({ _id: dealId, isActive: true, isDeleted: false });
      filter._id = { $in: deal && deal.products.length > 0 ? deal.products : [] };
    }

    // Filter by deal type collect products from all active deals of that type
    if (!dealId && dealType) {
      const typeDeals = await Deal.find({ type: dealType, isActive: true, isDeleted: false });
      const productIds = typeDeals.flatMap(d => d.products);
      filter._id = { $in: productIds };
    }

    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (search) {
      filter.$text = { $search: search };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = parseFloat(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = parseFloat(maxPrice);
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'name') sortOption = { name: 1 };

    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug').skip(skip).limit(limit).sort(sortOption),
      Product.countDocuments(filter),
    ]);

    await cacheSet(cacheKey, JSON.stringify({ products, total }), 300);
    sendPaginated(res, products, total, page, limit);
  })
);

// GET /api/v1/products/:slug
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug, isDeleted: false })
      .populate('category', 'name slug');
    if (!product) throw new NotFoundError('Product not found');
    sendSuccess(res, product);
  })
);

// POST /api/v1/products (admin)
router.post(
  '/',
  authenticate,
  authorize('super_admin'),
  validate(createProductSchema),
  asyncHandler(async (req, res) => {
    const slug = slugify(req.body.name);
    const existing = await Product.findOne({ slug, isDeleted: false });
    if (existing) throw new BadRequestError('Product with this name already exists');

    // images come as array of Cloudinary URLs in JSON body
    const images = Array.isArray(req.body.images) ? req.body.images : (req.body.images ? [req.body.images] : []);
    const product = await Product.create({ ...req.body, slug, images });

    await cacheDelPattern('products:*');
    await createAuditLog(req, 'CREATE_PRODUCT', 'Product', product._id.toString());
    sendSuccess(res, product, 'Product created', 201);
  })
);

// PUT /api/v1/products/:id (admin)
router.put(
  '/:id',
  authenticate,
  authorize('super_admin'),
  validate(updateProductSchema),
  asyncHandler(async (req, res) => {
    const existing = await Product.findById(req.params.id);
    if (!existing) throw new NotFoundError('Product not found');

    const updateData = { ...req.body };
    if (req.body.name) updateData.slug = slugify(req.body.name);

    // images come as array of Cloudinary URLs in JSON body
    if (req.body.images !== undefined) {
      const newImages: string[] = Array.isArray(req.body.images) ? req.body.images : (req.body.images ? [req.body.images] : []);
      updateData.images = newImages;

      // delete removed images from Cloudinary
      const removed = (existing.images || []).filter(url => !newImages.includes(url));
      await Promise.all(removed.map(async (url) => {
        const pid = extractPublicId(url);
        if (pid) await deleteFromCloudinary(pid).catch(() => {});
      }));
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!product) throw new NotFoundError('Product not found');

    await cacheDelPattern('products:*');
    await createAuditLog(req, 'UPDATE_PRODUCT', 'Product', req.params.id);
    sendSuccess(res, product, 'Product updated');
  })
);

// DELETE /api/v1/products/:id (admin, soft delete)
router.delete(
  '/:id',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!product) throw new NotFoundError('Product not found');

    // delete all images from Cloudinary
    await Promise.all((product.images || []).map(async (url) => {
      const pid = extractPublicId(url);
      if (pid) await deleteFromCloudinary(pid).catch(() => {});
    }));

    await cacheDelPattern('products:*');
    await createAuditLog(req, 'DELETE_PRODUCT', 'Product', req.params.id);
    sendSuccess(res, null, 'Product deleted');
  })
);

// PUT /api/v1/products/:id/stock (admin)
router.put(
  '/:id/stock',
  authenticate,
  authorize('super_admin', 'employee'),
  asyncHandler(async (req, res) => {
    const { stock } = req.body;
    if (typeof stock !== 'number' || stock < 0) throw new BadRequestError('Invalid stock value');

    const product = await Product.findByIdAndUpdate(req.params.id, { stock }, { new: true });
    if (!product) throw new NotFoundError('Product not found');

    await cacheDelPattern('products:*');
    await createAuditLog(req, 'UPDATE_STOCK', 'Product', req.params.id, { stock });
    sendSuccess(res, product, 'Stock updated');
  })
);

export default router;
