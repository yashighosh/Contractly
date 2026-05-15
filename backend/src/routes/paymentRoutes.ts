import express from 'express';
import { createRazorpayOrder, verifyPayment, createRegistrationOrder } from '../controllers/paymentController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/order', protect, createRazorpayOrder);
router.post('/registration-order', createRegistrationOrder);
router.post('/verify', protect, verifyPayment);

export default router;
