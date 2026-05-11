import { Request, Response } from 'express';
import Contract from '../models/Contract';
import SignatureRecord from '../models/SignatureRecord';
import { PdfService } from '../services/pdfService';
import { StorageService } from '../services/storageService';
import { NotificationService } from '../services/notificationService';
import { AuditService } from '../services/auditService';

export const viewContract = async (req: Request, res: Response) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }
    // Only return public data
    const { title, recipientName, content, status } = contract;
    res.json({ success: true, data: { title, recipientName, content, status } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const signContract = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { signerName, signerEmail, signatureData } = req.body;

    const contract = await Contract.findById(id);
    if (!contract || contract.status !== 'SENT') {
      return res.status(400).json({ success: false, message: 'Invalid or already signed contract' });
    }

    // 1. Create signature record
    const record = await SignatureRecord.create({
      contractId: contract._id,
      signerName,
      signerEmail,
      signatureData,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // 2. Update contract
    contract.status = 'SIGNED';
    contract.signedAt = new Date();
    contract.signatureId = record._id as any;
    
    // 3. Generate PDF
    const pdfPath = await PdfService.generateContractPdf(contract);
    
    // 4. Upload to Storage
    const storageUrl = await StorageService.uploadFile(
      pdfPath, 
      'contractly-vault', 
      `signed/${contract._id}.pdf`
    );
    
    contract.pdfUrl = storageUrl;
    await contract.save();

    // 5. Notifications
    await NotificationService.notifyContractSigned(contract.recipientEmail!, signerName);
    await AuditService.log(null, 'CONTRACT_SIGNED', `Contract ${contract._id} signed by ${signerName}`, req.ip);

    res.json({ success: true, message: 'Contract signed successfully', pdfUrl: storageUrl });
  } catch (error: any) {
    console.error('Signing Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
