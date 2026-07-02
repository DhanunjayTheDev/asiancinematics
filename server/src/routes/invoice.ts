import { Router } from 'express';
import Invoice from '../models/Invoice';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import { NotFoundError } from '../utils/errors';
import { authenticate, authorize } from '../middleware/auth';
import { createAuditLog } from '../services/auditService';

const router = Router();

// GET /api/v1/invoices/next-number
router.get(
  '/next-number',
  authenticate,
  authorize('super_admin', 'employee'),
  asyncHandler(async (_req, res) => {
    const last = await Invoice.findOne({ isDeleted: false }).sort({ createdAt: -1 }).select('invoiceNo');
    let nextNum = 1001;
    if (last) {
      const match = last.invoiceNo.match(/(\d+)$/);
      if (match) nextNum = parseInt(match[1], 10) + 1;
    }
    sendSuccess(res, { nextNumber: `INV-${nextNum}` });
  })
);

// GET /api/v1/invoices
router.get(
  '/',
  authenticate,
  authorize('super_admin', 'employee'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;

    const filter: Record<string, unknown> = { isDeleted: false };
    if (search) {
      filter.$or = [
        { invoiceNo: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { offerTitle: { $regex: search, $options: 'i' } },
      ];
    }

    const [invoices, total] = await Promise.all([
      Invoice.find(filter)
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Invoice.countDocuments(filter),
    ]);

    sendPaginated(res, invoices, total, page, limit);
  })
);

// GET /api/v1/invoices/:id
router.get(
  '/:id',
  authenticate,
  authorize('super_admin', 'employee'),
  asyncHandler(async (req, res) => {
    const invoice = await Invoice.findOne({ _id: req.params.id, isDeleted: false })
      .populate('createdBy', 'name');
    if (!invoice) throw new NotFoundError('Invoice not found');
    sendSuccess(res, invoice);
  })
);

// POST /api/v1/invoices
router.post(
  '/',
  authenticate,
  authorize('super_admin', 'employee'),
  asyncHandler(async (req, res) => {
    const body = req.body;
    const items = (body.items || []).map((item: any) => ({
      ...item,
      total: (Number(item.qty) || 0) * (Number(item.unitPrice) || 0),
    }));
    const grandTotal = items.reduce((s: number, i: any) => s + i.total, 0);

    const invoice = await Invoice.create({
      ...body,
      items,
      grandTotal,
      createdBy: req.user!._id,
    });

    await createAuditLog(req, 'CREATE_INVOICE', 'Invoice', invoice._id.toString());
    sendSuccess(res, invoice, 'Invoice saved', 201);
  })
);

// DELETE /api/v1/invoices/:id
router.delete(
  '/:id',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (!invoice) throw new NotFoundError('Invoice not found');
    await createAuditLog(req, 'DELETE_INVOICE', 'Invoice', req.params.id);
    sendSuccess(res, null, 'Invoice deleted');
  })
);

export default router;
