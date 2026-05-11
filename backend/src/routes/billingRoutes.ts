import express from 'express';
import { subscribeToPlan, razorpayWebhook } from '../controllers/billingController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/subscribe', protect, subscribeToPlan);
router.post('/webhook/razorpay', express.raw({ type: 'application/json' }), razorpayWebhook);

export default router;
