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
