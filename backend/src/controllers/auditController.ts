import { Request, Response } from 'express';
import AuditLog from '../models/AuditLog';

export const getAuditLog = async (req: any, res: Response) => {
  try {
    const logs = await AuditLog.find({ contractId: req.params.id, userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: logs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
