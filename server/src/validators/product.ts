import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    description: z.string().min(1),
    shortDescription: z.string().max(300).optional(),
    price: z.number().min(0),
    comparePrice: z.number().min(0).optional(),
    category: z.string().min(1),
    stock: z.number().int().min(0),
    sku: z.string().optional(),
    isFeatured: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    specifications: z.record(z.string()).optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().min(1).optional(),
    shortDescription: z.string().max(300).optional(),
    price: z.number().min(0).optional(),
    comparePrice: z.number().min(0).optional(),
    category: z.string().optional(),
    stock: z.number().int().min(0).optional(),
    sku: z.string().optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    specifications: z.record(z.string()).optional(),
  }),
  params: z.object({ id: z.string() }),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    parent: z.string().optional(),
    sortOrder: z.number().optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    parent: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().optional(),
  }),
  params: z.object({ id: z.string() }),
});
