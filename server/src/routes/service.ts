import { Router } from 'express';
import Service from '../models/Service';
import ServiceTicket from '../models/ServiceTicket';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { createServiceSchema, createServiceTicketSchema, updateTicketStatusSchema, addTicketCommentSchema, assignTicketSchema } from '../validators/service';
import { createAuditLog } from '../services/auditService';
import { createNotification } from '../services/notificationService';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const slugify = (text: string): string =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const generateTicketNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().slice(0, 4).toUpperCase();
  return `TKT-${timestamp}-${random}`;
};

// === SERVICE CATALOG ===

// GET /api/v1/services
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const services = await Service.find({ isDeleted: false, isActive: true }).sort({ sortOrder: 1 });
    sendSuccess(res, services);
  })
);

// GET /api/v1/services/:slug
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const service = await Service.findOne({ slug: req.params.slug, isDeleted: false });
    if (!service) throw new NotFoundError('Service not found');
    sendSuccess(res, service);
  })
);

// POST /api/v1/services (admin)
router.post(
  '/',
  authenticate,
  authorize('super_admin'),
  upload.single('image'),
  validate(createServiceSchema),
  asyncHandler(async (req, res) => {
    const slug = slugify(req.body.name);
    const existing = await Service.findOne({ slug, isDeleted: false });
    if (existing) throw new BadRequestError('Service with this name already exists');

    const image = req.file?.filename;
    const service = await Service.create({ ...req.body, slug, image });
    await createAuditLog(req, 'CREATE_SERVICE', 'Service', service._id.toString());
    sendSuccess(res, service, 'Service created', 201);
  })
);

// PUT /api/v1/services/:id (admin)
router.put(
  '/:id',
  authenticate,
  authorize('super_admin'),
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const updateData = { ...req.body };
    if (req.body.name) updateData.slug = slugify(req.body.name);
    if (req.file) updateData.image = req.file.filename;

    const service = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!service) throw new NotFoundError('Service not found');
    await createAuditLog(req, 'UPDATE_SERVICE', 'Service', req.params.id);
    sendSuccess(res, service, 'Service updated');
  })
);

// DELETE /api/v1/services/:id (admin)
router.delete(
  '/:id',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const service = await Service.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (!service) throw new NotFoundError('Service not found');
    await createAuditLog(req, 'DELETE_SERVICE', 'Service', req.params.id);
    sendSuccess(res, null, 'Service deleted');
  })
);

// === SERVICE TICKETS ===

// POST /api/v1/services/tickets
router.post(
  '/tickets',
  authenticate,
  validate(createServiceTicketSchema),
  asyncHandler(async (req, res) => {
    const ticket = await ServiceTicket.create({
      ...req.body,
      ticketNumber: generateTicketNumber(),
      user: req.user!._id,
    });
    sendSuccess(res, ticket, 'Service ticket created', 201);
  })
);

// GET /api/v1/services/tickets/my
router.get(
  '/tickets/my',
  authenticate,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { user: req.user!._id, isDeleted: false };
    const status = req.query.status as string;
    if (status) filter.status = status;

    const [tickets, total] = await Promise.all([
      ServiceTicket.find(filter).populate('service', 'name').skip(skip).limit(limit).sort({ createdAt: -1 }),
      ServiceTicket.countDocuments(filter),
    ]);

    sendPaginated(res, tickets, total, page, limit);
  })
);

// GET /api/v1/services/tickets/all (admin + support)
router.get(
  '/tickets/all',
  authenticate,
  authorize('super_admin', 'support', 'employee'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;
    const priority = req.query.priority as string;
    const search = req.query.search as string;

    const filter: Record<string, unknown> = { isDeleted: false };
    if (req.user!.role === 'support') filter.assignedTo = req.user!._id;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.ticketNumber = { $regex: search, $options: 'i' };

    const [tickets, total] = await Promise.all([
      ServiceTicket.find(filter)
        .populate('user', 'name email phone')
        .populate('service', 'name')
        .populate('assignedTo', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      ServiceTicket.countDocuments(filter),
    ]);

    sendPaginated(res, tickets, total, page, limit);
  })
);

// GET /api/v1/services/tickets/:id
router.get(
  '/tickets/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = { _id: req.params.id, isDeleted: false };
    if (!['super_admin', 'support', 'employee'].includes(req.user!.role)) {
      filter.user = req.user!._id;
    }

    const ticket = await ServiceTicket.findOne(filter)
      .populate('user', 'name email phone')
      .populate('service', 'name')
      .populate('assignedTo', 'name')
      .populate('comments.user', 'name role');
    if (!ticket) throw new NotFoundError('Ticket not found');
    sendSuccess(res, ticket);
  })
);

// PUT /api/v1/services/tickets/:id/status
router.put(
  '/tickets/:id/status',
  authenticate,
  authorize('super_admin', 'support', 'employee'),
  validate(updateTicketStatusSchema),
  asyncHandler(async (req, res) => {
    const ticket = await ServiceTicket.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!ticket) throw new NotFoundError('Ticket not found');

    await createNotification(ticket.user.toString(), 'Ticket Update', `Ticket ${ticket.ticketNumber} is now ${req.body.status}`, 'ticket');
    await createAuditLog(req, 'UPDATE_TICKET_STATUS', 'ServiceTicket', req.params.id, { status: req.body.status });
    sendSuccess(res, ticket, 'Ticket status updated');
  })
);

// POST /api/v1/services/tickets/:id/comments
router.post(
  '/tickets/:id/comments',
  authenticate,
  validate(addTicketCommentSchema),
  asyncHandler(async (req, res) => {
    const ticket = await ServiceTicket.findById(req.params.id);
    if (!ticket || ticket.isDeleted) throw new NotFoundError('Ticket not found');

    ticket.comments.push({
      user: req.user!._id as any,
      message: req.body.message,
      createdAt: new Date(),
    });
    await ticket.save();

    sendSuccess(res, ticket, 'Comment added');
  })
);

// PUT /api/v1/services/tickets/:id/assign
router.put(
  '/tickets/:id/assign',
  authenticate,
  authorize('super_admin'),
  validate(assignTicketSchema),
  asyncHandler(async (req, res) => {
    const updateData: Record<string, unknown> = { assignedTo: req.body.assignedTo };
    if (req.body.priority) updateData.priority = req.body.priority;

    const ticket = await ServiceTicket.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('assignedTo', 'name');
    if (!ticket) throw new NotFoundError('Ticket not found');

    await createNotification(req.body.assignedTo, 'Ticket Assigned', `Ticket ${ticket.ticketNumber} has been assigned to you`, 'assignment');
    await createAuditLog(req, 'ASSIGN_TICKET', 'ServiceTicket', req.params.id, { assignedTo: req.body.assignedTo });
    sendSuccess(res, ticket, 'Ticket assigned');
  })
);

export default router;
