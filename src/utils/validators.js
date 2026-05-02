import { z } from 'zod';

export const loginSchema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  plan:     z.enum(['freelancer', 'agency']).default('freelancer'),
});

export const contractSchema = z.object({
  title:      z.string().min(2, 'Contract title is required'),
  clientId:   z.string().optional(),
  clientName: z.string().optional(),
  clientEmail:z.string().email('Enter a valid email').optional().or(z.literal('')),
  amount:     z.number().min(0, 'Amount must be positive').optional(),
  startDate:  z.string().optional(),
  endDate:    z.string().optional(),
  content:    z.string().optional(),
});

export const sendContractSchema = z.object({
  email:   z.string().email('Enter a valid email address'),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().optional(),
  expiryDays: z.number().min(1).max(90).default(7),
});

export const signSchema = z.object({
  fullName:    z.string().min(2, 'Full name is required'),
  agreedToTerms: z.boolean().refine((v) => v === true, 'You must agree to the terms'),
});

export const clientSchema = z.object({
  name:    z.string().min(2, 'Name is required'),
  email:   z.string().email('Valid email required'),
  phone:   z.string().optional(),
  company: z.string().optional(),
  gstin:   z.string().optional(),
});
