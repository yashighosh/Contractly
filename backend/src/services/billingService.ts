import Razorpay from 'razorpay';
import User from '../models/User';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'mock_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret',
});

export class BillingService {
  static async createSubscription(userId: string, planId: string) {
    if (!process.env.RAZORPAY_KEY_ID) {
      console.log(`Mock subscription creation for user ${userId} to plan ${planId}`);
      return { id: `sub_mock_${Date.now()}` };
    }
    
    // In a real app, you would fetch the plan ID mapped to your plans
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12,
    });
    return subscription;
  }

  static async handleWebhook(event: any) {
    console.log('Received Billing Webhook:', event.event);
    
    if (event.event === 'subscription.charged') {
      const subId = event.payload.subscription.entity.id;
      // Find user by subscriptionId and ensure plan is active
      // await User.findOneAndUpdate({ subscriptionId: subId }, { plan: 'PRO' });
    }
  }
}
