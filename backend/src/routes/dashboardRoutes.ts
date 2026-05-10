import express from 'express';
import { getStats, getRecentActivity } from '../controllers/dashboardController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/stats', getStats);
router.get('/recent', getRecentActivity);

export default router;
