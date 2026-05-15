import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from './routes/authRoutes';
import contractRoutes from './routes/contractRoutes';
import clientRoutes from './routes/clientRoutes';
import templateRoutes from './routes/templateRoutes';
import clauseRoutes from './routes/clauseRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import signatureRoutes from './routes/signatureRoutes';
import auditRoutes from './routes/auditRoutes';
import adminRoutes from './routes/adminRoutes';
import billingRoutes from './routes/billingRoutes';
import paymentRoutes from './routes/paymentRoutes';
import rateLimit from 'express-rate-limit';
import * as Sentry from '@sentry/node';
import { PostHog } from 'posthog-node';

// Setup PostHog
export const posthog = new PostHog(process.env.POSTHOG_API_KEY || 'mock_key', { host: 'https://app.posthog.com' });

// Setup Sentry
Sentry.init({ dsn: process.env.SENTRY_DSN || '' });

// API Gateway features: Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/contracts', contractRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/clauses', clauseRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/sign', signatureRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.get('/api/v1/payments-test', (req, res) => res.json({ message: 'payments path reachable' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

const PORT = process.env.PORT || 8082;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
