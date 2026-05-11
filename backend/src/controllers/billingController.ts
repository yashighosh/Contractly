import { Request, Response } from 'express';
import { BillingService } from '../services/billingService';
import User from '../models/User';

export const subscribeToPlan = async (req: any, res: Response) => {
  try {
    const { planId } = req.body;
    const subscription = await BillingService.createSubscription(req.user._id, planId);
    
    await User.findByIdAndUpdate(req.user._id, { subscriptionId: subscription.id });
    
    res.json({ success: true, data: subscription });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const razorpayWebhook = async (req: Request, res: Response) => {
  try {
    // In production, verify Razorpay signature here
    await BillingService.handleWebhook(req.body);
    res.status(200).send('OK');
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook Error');
  }
};
