import User from '../models/User';
import Contract from '../models/Contract';

const PLAN_LIMITS = {
  FREE: { maxContracts: 3, watermark: true },
  PRO: { maxContracts: 100, watermark: false },
  TEAM: { maxContracts: 9999, watermark: false },
};

export class PlanLimitService {
  static async checkContractLimit(userId: string): Promise<{ allowed: boolean; reason?: string }> {
    const user = await User.findById(userId);
    if (!user) return { allowed: false, reason: 'User not found' };

    const plan = user.plan as keyof typeof PLAN_LIMITS;
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;

    const contractCount = await Contract.countDocuments({ userId });
    
    if (contractCount >= limits.maxContracts) {
      return { allowed: false, reason: `Plan limit reached. Upgrade to create more than ${limits.maxContracts} contracts.` };
    }

    return { allowed: true };
  }

  static async getPdfOptions(userId: string) {
    const user = await User.findById(userId);
    const plan = (user?.plan as keyof typeof PLAN_LIMITS) || 'FREE';
    return {
      watermark: PLAN_LIMITS[plan].watermark
    };
  }
}
