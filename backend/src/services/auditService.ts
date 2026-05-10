import AuditLog from '../models/AuditLog';

export class AuditService {
  static async log(userId: string | null, action: string, details: string, ip: string = '0.0.0.0') {
    try {
      await AuditLog.create({
        user: userId,
        action,
        details,
        ipAddress: ip
      });
    } catch (error) {
      console.error('Audit Log Error:', error);
    }
  }
}
