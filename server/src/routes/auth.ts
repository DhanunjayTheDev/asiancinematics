import { Router } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendError } from '../utils/response';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../utils/errors';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema, createUserSchema, updateUserRoleSchema } from '../validators/auth';
import { createAuditLog } from '../services/auditService';
import rateLimit from 'express-rate-limit';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '5', 10),
  message: { success: false, message: 'Too many login attempts, try again later', data: null },
});

const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign({ userId, role }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  } as jwt.SignOptions);
  const refreshToken = jwt.sign({ userId, role }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpire,
  } as jwt.SignOptions);
  return { accessToken, refreshToken };
};

// POST /api/v1/auth/register
router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { name, email, phone, password } = req.body;

    const existing = await User.findOne({ email, isDeleted: false });
    if (existing) throw new BadRequestError('Email already registered');

    const user = await User.create({ name, email, phone, password });
    const tokens = generateTokens(user._id.toString(), user.role);

    await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken, lastLogin: new Date() });

    sendSuccess(res, {
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      ...tokens,
    }, 'Registration successful', 201);
  })
);

// POST /api/v1/auth/login
router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isDeleted: false }).select('+password');
    if (!user || !user.isActive) throw new UnauthorizedError('Invalid credentials');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new UnauthorizedError('Invalid credentials');

    const tokens = generateTokens(user._id.toString(), user.role);
    await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken, lastLogin: new Date() });

    sendSuccess(res, {
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      ...tokens,
    }, 'Login successful');
  })
);

// POST /api/v1/auth/refresh
router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new UnauthorizedError('Refresh token required');

    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: string; role: string };
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken || !user.isActive || user.isDeleted) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const tokens = generateTokens(user._id.toString(), user.role);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    sendSuccess(res, tokens, 'Token refreshed');
  })
);

// POST /api/v1/auth/logout
router.post(
  '/logout',
  authenticate,
  asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user!._id, { refreshToken: null });
    sendSuccess(res, null, 'Logged out');
  })
);

// GET /api/v1/auth/me
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!._id);
    if (!user) throw new NotFoundError('User not found');
    sendSuccess(res, user);
  })
);

// PUT /api/v1/auth/profile
router.put(
  '/profile',
  authenticate,
  validate(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user!._id, req.body, { new: true, runValidators: true });
    sendSuccess(res, user, 'Profile updated');
  })
);

// PUT /api/v1/auth/change-password
router.put(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user!._id).select('+password');
    if (!user) throw new NotFoundError('User not found');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new BadRequestError('Current password is incorrect');

    user.password = newPassword;
    await user.save();
    sendSuccess(res, null, 'Password changed');
  })
);

// --- Admin User Management ---

// GET /api/v1/auth/users
router.get(
  '/users',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const role = req.query.role as string;
    const search = req.query.search as string;

    const filter: Record<string, unknown> = { isDeleted: false };
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    sendSuccess(res, users, 'Users fetched', 200, { page, limit, total, totalPages: Math.ceil(total / limit) });
  })
);

// POST /api/v1/auth/users
router.post(
  '/users',
  authenticate,
  authorize('super_admin'),
  validate(createUserSchema),
  asyncHandler(async (req, res) => {
    const { name, email, phone, password, role } = req.body;
    const existing = await User.findOne({ email, isDeleted: false });
    if (existing) throw new BadRequestError('Email already exists');

    const user = await User.create({ name, email, phone, password, role });
    await createAuditLog(req, 'CREATE_USER', 'User', user._id.toString(), { role });
    sendSuccess(res, user, 'User created', 201);
  })
);

// PUT /api/v1/auth/users/:id/role
router.put(
  '/users/:id/role',
  authenticate,
  authorize('super_admin'),
  validate(updateUserRoleSchema),
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    if (!user) throw new NotFoundError('User not found');
    await createAuditLog(req, 'UPDATE_ROLE', 'User', req.params.id, { role: req.body.role });
    sendSuccess(res, user, 'Role updated');
  })
);

// PUT /api/v1/auth/users/:id/toggle-active
router.put(
  '/users/:id/toggle-active',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError('User not found');

    user.isActive = !user.isActive;
    await user.save();
    await createAuditLog(req, 'TOGGLE_USER_STATUS', 'User', req.params.id, { isActive: user.isActive });
    sendSuccess(res, user, `User ${user.isActive ? 'activated' : 'deactivated'}`);
  })
);

// DELETE /api/v1/auth/users/:id (soft delete)
router.delete(
  '/users/:id',
  authenticate,
  authorize('super_admin'),
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!user) throw new NotFoundError('User not found');
    await createAuditLog(req, 'DELETE_USER', 'User', req.params.id);
    sendSuccess(res, null, 'User deleted');
  })
);

export default router;
