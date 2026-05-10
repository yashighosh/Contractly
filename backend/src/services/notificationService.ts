export class NotificationService {
  static async sendEmail(to: string, subject: string, body: string) {
    // Placeholder for SMTP/SES/SendGrid integration
    console.log('--- EMAIL SENT ---');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body Preview:', body.substring(0, 50) + '...');
    console.log('------------------');
    
    return true;
  }

  static async notifyNewContract(to: string, clientName: string, contractId: string) {
    const body = `Hi ${clientName}, a new contract has been created for you on Contractly. Please review and sign it at: https://contractly.in/sign/${contractId}`;
    return this.sendEmail(to, 'Action Required: New Contract for Review', body);
  }

  static async notifyContractSigned(to: string, clientName: string) {
    const body = `Hi, ${clientName} has signed the contract. You can download the signed copy from your dashboard.`;
    return this.sendEmail(to, 'Contract Signed!', body);
  }
}
