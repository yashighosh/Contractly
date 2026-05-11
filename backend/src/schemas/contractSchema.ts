import { z } from 'zod';

export const createContractSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    clientName: z.string().min(2).max(100),
    clientEmail: z.string().email(),
    content: z.string().min(10),
    status: z.enum(['DRAFT', 'SENT', 'SIGNED']).optional()
  })
});

export const updateContractSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    clientName: z.string().min(2).max(100).optional(),
    clientEmail: z.string().email().optional(),
    content: z.string().min(10).optional(),
    status: z.enum(['DRAFT', 'SENT', 'SIGNED']).optional()
  }),
  params: z.object({
    id: z.string()
  })
});
