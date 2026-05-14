import { z } from 'zod';

export const createContractSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100),
    recipientName: z.string().max(100).optional(),
    recipientEmail: z.string().email().optional().or(z.literal('')),
    content: z.string().optional(),
    status: z.enum(['DRAFT', 'SENT', 'VIEWED', 'SIGNED', 'EXPIRED']).optional(),
    amount: z.number().optional().nullable(),
    variablesData: z.string().optional()
  })
});

export const updateContractSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    recipientName: z.string().max(100).optional(),
    recipientEmail: z.string().email().optional().or(z.literal('')),
    content: z.string().optional(),
    status: z.enum(['DRAFT', 'SENT', 'VIEWED', 'SIGNED', 'EXPIRED']).optional(),
    amount: z.number().optional().nullable(),
    variablesData: z.string().optional()
  }),
  params: z.object({
    id: z.string()
  })
});
