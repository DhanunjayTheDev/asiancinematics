import { Router } from 'express';
import Registration from '../models/Registration';
import User from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { authenticate, authorize } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router = Router();

const createSchema = z.object({
  body: z.object({
    type: z.enum(['partner', 'freelancer', 'employee']),
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(10),
    city: z.string().optional(),
    company: z.string().optional(),
    partnerType: z.string().optional(),
    skills: z.array(z.string()).optional(),
    portfolio: z.string().optional(),
    availability: z.string().optional(),
    position: z.string().optional(),
    qualification: z.string().optional(),
    resumeLink: z.string().optional(),
    experience: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    message: z.string().optional(),
  }),
});

// POST /api/v1/registrations  public submit
router.post(
  '/',
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const existing = await Registration.findOne({
      email: req.body.email,
      type: req.body.type,
      status: { $ne: 'rejected' },
      isDeleted: false,
    });
    if (existing) throw new BadRequestError('Application already submitted with this email');

    const reg = await Registration.create(req.body);
    sendSuccess(res, reg, 'Registration submitted successfully', 201);
  })
);

// GET /api/v1/registrations/all  admin
router.get(
  '/all',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type as string;
    const status = req.query.status as string;

    const filter: Record<string, unknown> = { isDeleted: false };
    if (type && type !== 'all') filter.type = type;
    if (status && status !== 'all') filter.status = status;

    const [regs, total] = await Promise.all([
      Registration.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Registration.countDocuments(filter),
    ]);
    sendPaginated(res, regs, total, page, limit);
  })
);

// PUT /api/v1/registrations/:id/status  admin approve/reject
router.put(
  '/:id/status',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const { status, rejectionReason } = req.body;
    const reg = await Registration.findById(req.params.id).select('+password');
    if (!reg || reg.isDeleted) throw new NotFoundError('Registration not found');

    reg.status = status;
    if (rejectionReason) reg.rejectionReason = rejectionReason;

    if (status === 'approved') {
      const userRole = reg.type === 'partner' ? 'customer' : (reg.type as 'freelancer' | 'employee');
      const existingUser = await User.findOne({ email: reg.email, isDeleted: false });

      if (!existingUser) {
        // Use the password the user set during registration.
        // Pass plain text — pre-save hook hashes it (no double-hash).
        const plainPassword = reg.password || `PWT@${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        const newUser = await User.create({
          name: reg.name,
          email: reg.email,
          phone: reg.phone,
          password: plainPassword,
          role: userRole,
          isActive: true,
        });
        reg.approvedUserId = newUser._id as any;
      } else {
        reg.approvedUserId = existingUser._id as any;
      }

      // Clear stored password after account creation
      reg.password = undefined;
    }

    await reg.save();
    sendSuccess(res, reg, `Registration ${status}`);
  })
);

// GET /api/v1/registrations/staff  approved employees + freelancers (assign dropdown)
router.get(
  '/staff',
  authenticate,
  authorize('super_admin', 'support'),
  asyncHandler(async (req, res) => {
    const staff = await User.find({
      role: { $in: ['employee', 'freelancer', 'support'] },
      isActive: true,
      isDeleted: false,
    }).select('name email role');
    sendSuccess(res, staff);
  })
);

export default router;
