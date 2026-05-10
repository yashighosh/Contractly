import express from 'express';
import { getAllUsers, getSystemStats } from '../controllers/adminController';
import { protect, isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(isAdmin);

router.get('/users', getAllUsers);
router.get('/stats', getSystemStats);

export default router;
