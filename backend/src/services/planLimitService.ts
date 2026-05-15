import User from '../models/User';
import Contract from '../models/Contract';

const PLAN_LIMITS = {
  FREE: { maxFreeContracts: 5, label: 'Free', watermark: true },
  PRO: { maxFreeContracts: Infinity, label: 'Pro', watermark: false },
  AGENCY: { maxFreeContracts: Infinity, label: 'Agency', watermark: false },
};

export class PlanLimitService {
  static async checkContractLimit(userId: string): Promise<{ allowed: boolean; reason?: string }> {
    // We now allow unlimited creation but apply watermarks after 5 on free plan
    // So we just return allowed: true for now, unless there's a real system limit
    return { allowed: true };
  }

  static async getUsage(userId: string) {
    const user = await User.findById(userId);
    const plan = (user?.plan || 'FREE').toUpperCase() as keyof typeof PLAN_LIMITS;
    const contractCount = await Contract.countDocuments({ userId });
    
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
    const isOverLimit = plan === 'FREE' && contractCount >= limits.maxFreeContracts;

    return {
      plan,
      contractCount,
      maxFreeContracts: limits.maxFreeContracts,
      isOverLimit,
      applyWatermark: isOverLimit
    };
  }

  static async getPdfOptions(userId: string) {
    const user = await User.findById(userId);
    const plan = (user?.plan as keyof typeof PLAN_LIMITS) || 'FREE';
    return {
      watermark: PLAN_LIMITS[plan].watermark
    };
  }
}
