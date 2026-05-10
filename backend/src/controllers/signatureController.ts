import { Request, Response } from 'express';
import Contract from '../models/Contract';
import SignatureRecord from '../models/SignatureRecord';
import crypto from 'crypto';

export const viewContract = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const contract = await Contract.findOne({ signToken: token });

    if (!contract) {
      return res.status(404).json({ success: false, message: 'Invalid or expired token' });
    }

    if (contract.status === 'SENT') {
      contract.status = 'VIEWED';
      contract.viewedAt = new Date();
      await contract.save();
    }

    res.json({ success: true, data: contract });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const signContract = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { signerName, signerEmail, signatureData } = req.body;

    const contract = await Contract.findOne({ signToken: token });

    if (!contract) {
      return res.status(404).json({ success: false, message: 'Invalid or expired token' });
    }

    const documentHash = crypto.createHash('sha256').update(contract.content || '').digest('hex');

    const signature = await SignatureRecord.create({
      contractId: contract._id,
      signerName,
      signerEmail,
      signatureData,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      documentHash,
    });

    contract.status = 'SIGNED';
    contract.signedAt = new Date();
    await contract.save();

    res.json({ success: true, message: 'Contract signed successfully', data: signature });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
