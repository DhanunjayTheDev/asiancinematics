import { Router } from 'express';
import Address from '../models/Address';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { NotFoundError } from '../utils/errors';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { createAddressSchema, updateAddressSchema } from '../validators/address';

const router = Router();

// GET /api/v1/addresses
router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const addresses = await Address.find({ user: req.user!._id, isDeleted: false }).sort({ isDefault: -1, createdAt: -1 });
    sendSuccess(res, addresses);
  })
);

// POST /api/v1/addresses
router.post(
  '/',
  authenticate,
  validate(createAddressSchema),
  asyncHandler(async (req, res) => {
    const data = { ...req.body, user: req.user!._id };

    if (data.isDefault) {
      await Address.updateMany({ user: req.user!._id, isDeleted: false }, { isDefault: false });
    }

    const address = await Address.create(data);
    sendSuccess(res, address, 'Address created', 201);
  })
);

// PUT /api/v1/addresses/:id
router.put(
  '/:id',
  authenticate,
  validate(updateAddressSchema),
  asyncHandler(async (req, res) => {
    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user!._id, isDeleted: false }, { isDefault: false });
    }

    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!address) throw new NotFoundError('Address not found');
    sendSuccess(res, address, 'Address updated');
  })
);

// PUT /api/v1/addresses/:id/default
router.put(
  '/:id/default',
  authenticate,
  asyncHandler(async (req, res) => {
    await Address.updateMany({ user: req.user!._id, isDeleted: false }, { isDefault: false });
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id, isDeleted: false },
      { isDefault: true },
      { new: true }
    );
    if (!address) throw new NotFoundError('Address not found');
    sendSuccess(res, address, 'Default address set');
  })
);

// DELETE /api/v1/addresses/:id
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!address) throw new NotFoundError('Address not found');
    sendSuccess(res, null, 'Address deleted');
  })
);

export default router;
