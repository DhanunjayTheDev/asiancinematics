import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        product: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    ).min(1, 'At least one item is required'),
    shippingAddress: z.object({
      fullName: z.string().min(1),
      phone: z.string().min(10),
      addressLine1: z.string().min(1),
      addressLine2: z.string().optional(),
      city: z.string().min(1),
      state: z.string().min(1),
      pincode: z.string().min(1),
      country: z.string().optional(),
    }),
    paymentMethod: z.enum(['COD', 'online']),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'processing', 'completed', 'cancelled']),
    notes: z.string().optional(),
    cancelReason: z.string().optional(),
  }),
  params: z.object({ id: z.string() }),
});

export const assignOrderSchema = z.object({
  body: z.object({
    assignedTo: z.string().min(1),
  }),
  params: z.object({ id: z.string() }),
});
