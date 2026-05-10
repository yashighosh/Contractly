import { Response } from 'express';
import User from '../models/User';
import Contract from '../models/Contract';

export const getAllUsers = async (req: any, res: Response) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSystemStats = async (req: any, res: Response) => {
  try {
    const userCount = await User.countDocuments();
    const contractCount = await Contract.countDocuments();
    const recentUsers = await User.find().select('fullName email createdAt').sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalUsers: userCount,
        totalContracts: contractCount,
        recentRegistrations: recentUsers,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
