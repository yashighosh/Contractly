import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import User from '../models/User';
import { AuditService } from '../services/auditService';

export const createRazorpayOrder = async (req: any, res: Response) => {
  try {
    const { planId } = req.body;
    let amount = 0;
    
    if (planId === 'PRO') amount = 499;
    else if (planId === 'AGENCY') amount = 1499;
    else return res.status(400).json({ success: false, message: 'Invalid plan' });

    const order = await PaymentService.createOrder(
      amount, 
      'INR', 
      `receipt_${req.user._id}_${Date.now()}`
    );

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRegistrationOrder = async (req: Request, res: Response) => {
  try {
    const { planId, email } = req.body;
    let amount = 0;
    
    if (planId === 'PRO') amount = 499;
    else if (planId === 'AGENCY') amount = 1499;
    else return res.status(400).json({ success: false, message: 'Invalid plan' });

    // Use email or a random string for receipt since user doesn't exist yet
    const receipt = `reg_${email?.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}`.substring(0, 40);

    const order = await PaymentService.createOrder(
      amount, 
      'INR', 
      receipt
    );

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req: any, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

    const isVerified = PaymentService.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isVerified) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Update user plan
    const user = await User.findById(req.user._id);
    if (user) {
      user.plan = planId;
      user.subscriptionId = razorpay_payment_id; // Storing payment ID as a reference
      await user.save();
      
      await AuditService.log(user._id.toString(), 'SUBSCRIPTION_UPGRADE', `Upgraded to ${planId} plan`, req.ip);
    }

    res.json({ success: true, message: 'Payment verified and plan updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
