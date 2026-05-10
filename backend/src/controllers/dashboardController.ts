import { Request, Response } from 'express';
import Contract from '../models/Contract';
import AuditLog from '../models/AuditLog';

export const getStats = async (req: any, res: Response) => {
  try {
    const totalContracts = await Contract.countDocuments({ userId: req.user._id });
    const signedContracts = await Contract.countDocuments({ userId: req.user._id, status: 'SIGNED' });
    const draftContracts = await Contract.countDocuments({ userId: req.user._id, status: 'DRAFT' });
    const sentContracts = await Contract.countDocuments({ userId: req.user._id, status: 'SENT' });

    res.json({
      success: true,
      data: {
        total: totalContracts,
        signed: signedContracts,
        draft: draftContracts,
        sent: sentContracts,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecentActivity = async (req: any, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const activity = await AuditLog.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('contractId', 'title');
    res.json({ success: true, data: activity });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
