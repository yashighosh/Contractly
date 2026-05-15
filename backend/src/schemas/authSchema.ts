import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().min(2).max(100),
    companyName: z.string().optional(),
    role: z.string().optional(),
    agencyWebsite: z.string().optional(),
    teamSize: z.string().optional(),
    location: z.string().optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  })
});
