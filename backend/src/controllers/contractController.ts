import { AuditService } from '../services/auditService';
import { NotificationService } from '../services/notificationService';

export const createContract = async (req: any, res: Response) => {
  try {
    const contract = await Contract.create({
      ...req.body,
      userId: req.user._id,
    });
    
    await AuditService.log(req.user._id, 'CONTRACT_CREATE', `Created contract: ${contract.title}`, req.ip);
    
    res.status(201).json({ success: true, message: 'Contract created', data: contract });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listContracts = async (req: any, res: Response) => {
  try {
    const filter: any = { userId: req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const contracts = await Contract.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: contracts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getContractById = async (req: any, res: Response) => {
  try {
    const contract = await Contract.findOne({ _id: req.params.id, userId: req.user._id });
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }
    res.json({ success: true, data: contract });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContract = async (req: any, res: Response) => {
  try {
    const contract = await Contract.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }
    
    await AuditService.log(req.user._id, 'CONTRACT_UPDATE', `Updated contract: ${contract.title}`, req.ip);
    
    res.json({ success: true, message: 'Contract updated', data: contract });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContract = async (req: any, res: Response) => {
  try {
    const contract = await Contract.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }
    
    await AuditService.log(req.user._id, 'CONTRACT_DELETE', `Deleted contract: ${contract.title}`, req.ip);
    
    res.json({ success: true, message: 'Contract deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendContract = async (req: any, res: Response) => {
  try {
    const contract = await Contract.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status: 'SENT', sentAt: new Date() },
      { new: true }
    );
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }
    
    await NotificationService.notifyNewContract(contract.clientEmail, contract.clientName, contract._id.toString());
    await AuditService.log(req.user._id, 'CONTRACT_SEND', `Sent contract to ${contract.clientEmail}`, req.ip);
    
    res.json({ success: true, message: 'Contract sent to recipient', data: contract });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const duplicateContract = async (req: any, res: Response) => {
  try {
    const contract = await Contract.findOne({ _id: req.params.id, userId: req.user._id });
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }
    const { _id, createdAt, updatedAt, status, sentAt, viewedAt, signedAt, expiredAt, ...rest } = contract.toObject();
    const duplicated = await Contract.create({ ...rest, title: `${rest.title} (Copy)`, status: 'DRAFT' });
    res.status(201).json({ success: true, message: 'Contract duplicated', data: duplicated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
