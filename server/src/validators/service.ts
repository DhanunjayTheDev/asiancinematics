import { z } from 'zod';

export const createServiceTicketSchema = z.object({
  body: z.object({
    service: z.string().optional(),
    subject: z.string().min(1).max(200),
    description: z.string().min(1),
    priority: z.enum(['low', 'medium', 'high']).optional(),
  }),
});

export const updateTicketStatusSchema = z.object({
  body: z.object({
    status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
  }),
  params: z.object({ id: z.string() }),
});

export const addTicketCommentSchema = z.object({
  body: z.object({
    message: z.string().min(1),
  }),
  params: z.object({ id: z.string() }),
});

export const assignTicketSchema = z.object({
  body: z.object({
    assignedTo: z.string().min(1),
    priority: z.enum(['low', 'medium', 'high']).optional(),
  }),
  params: z.object({ id: z.string() }),
});

export const createSiteVisitSchema = z.object({
  body: z.object({
    date: z.string().min(1),
    timeSlot: z.string().min(1),
    location: z.object({
      address: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      pincode: z.string().min(1),
    }),
    purpose: z.string().min(1),
    notes: z.string().optional(),
  }),
});

export const createInquirySchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().min(10),
    subject: z.string().min(1).max(200),
    message: z.string().min(1),
    budget: z.string().optional(),
    requirements: z.string().optional(),
    source: z.enum(['website', 'whatsapp', 'phone', 'email', 'other']).optional(),
  }),
});

export const createServiceSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    description: z.string().min(1),
    shortDescription: z.string().max(300).optional(),
    price: z.number().min(0).optional(),
    sortOrder: z.number().optional(),
    features: z.preprocess(
      (v) => v === undefined || v === null ? [] : Array.isArray(v) ? v : [v],
      z.array(z.string().min(1))
    ).optional(),
    emoji: z.string().optional(),
    badge: z.string().optional(),
    accentColor: z.enum(['blue', 'cyan', 'orange', 'purple', 'yellow', 'amber', 'green', 'red']).optional(),
  }),
});
