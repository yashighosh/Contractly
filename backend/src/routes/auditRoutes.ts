import express from 'express';
import { getAuditLog } from '../controllers/auditController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/contracts/:id', getAuditLog);

export default router;
