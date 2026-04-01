import { z } from 'zod';

export const createAddressSchema = z.object({
  body: z.object({
    label: z.string().optional(),
    fullName: z.string().min(1),
    phone: z.string().min(10),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(1),
    country: z.string().optional(),
    isDefault: z.boolean().optional(),
  }),
});

export const updateAddressSchema = z.object({
  body: z.object({
    label: z.string().optional(),
    fullName: z.string().min(1).optional(),
    phone: z.string().min(10).optional(),
    addressLine1: z.string().min(1).optional(),
    addressLine2: z.string().optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    pincode: z.string().min(1).optional(),
    country: z.string().optional(),
    isDefault: z.boolean().optional(),
  }),
  params: z.object({ id: z.string() }),
});
