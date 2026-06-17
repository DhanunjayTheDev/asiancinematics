import { Router } from 'express';
import SiteVisit from '../models/SiteVisit';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import { NotFoundError } from '../utils/errors';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { createSiteVisitSchema } from '../validators/service';
import { createAuditLog } from '../services/auditService';
import { createNotification } from '../services/notificationService';

const router = Router();

// POST /api/v1/site-visits
router.post(
  '/',
  authenticate,
  validate(createSiteVisitSchema),
  asyncHandler(async (req, res) => {
    const visit = await SiteVisit.create({ ...req.body, user: req.user!._id, date: new Date(req.body.date) });
    sendSuccess(res, visit, 'Site visit booked', 201);
  })
);

// GET /api/v1/site-visits/my
router.get(
  '/my',
  authenticate,
  asyncHandler(async (req, res) => {
    const visits = await SiteVisit.find({ user: req.user!._id, isDeleted: false })
      .sort({ date: -1 });
    sendSuccess(res, visits);
  })
);

// GET /api/v1/site-visits/all (admin + staff)
router.get(
  '/all',
  authenticate,
  authorize('super_admin', 'support', 'employee', 'freelancer'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;

    const filter: Record<string, unknown> = { isDeleted: false };
    if (status) filter.status = status;
    if (['employee', 'freelancer', 'support'].includes(req.user!.role)) {
      filter.assignedTo = req.user!._id;
    }

    const [visits, total] = await Promise.all([
      SiteVisit.find(filter)
        .populate('user', 'name email phone')
        .populate('assignedTo', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 }),
      SiteVisit.countDocuments(filter),
    ]);

    sendPaginated(res, visits, total, page, limit);
  })
);

// PUT /api/v1/site-visits/:id/status
router.put(
  '/:id/status',
  authenticate,
  authorize('super_admin', 'support', 'employee', 'freelancer'),
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const visit = await SiteVisit.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!visit) throw new NotFoundError('Site visit not found');

    await createNotification(visit.user.toString(), 'Visit Update', `Your site visit is now ${status}`, 'visit');
    await createAuditLog(req, 'UPDATE_VISIT_STATUS', 'SiteVisit', req.params.id, { status });
    sendSuccess(res, visit, 'Status updated');
  })
);

// PUT /api/v1/site-visits/:id/assign
router.put(
  '/:id/assign',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const visit = await SiteVisit.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.assignedTo },
      { new: true }
    ).populate('assignedTo', 'name');
    if (!visit) throw new NotFoundError('Site visit not found');

    await createNotification(req.body.assignedTo, 'Visit Assigned', 'A site visit has been assigned to you', 'assignment');
    await createAuditLog(req, 'ASSIGN_VISIT', 'SiteVisit', req.params.id);
    sendSuccess(res, visit, 'Visit assigned');
  })
);

export default router;
