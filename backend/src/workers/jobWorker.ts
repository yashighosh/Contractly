import { createWorker } from '../config/queue';
import { PdfService } from '../services/pdfService';
import { NotificationService } from '../services/notificationService';
import Contract from '../models/Contract';

export const startWorker = () => {
  const worker = createWorker(async (job: any) => {
    console.log(`Processing job ${job.id} of type ${job.name}`);
    
    try {
      if (job.name === 'generate-pdf') {
        const { contractId } = job.data;
        const contract = await Contract.findById(contractId);
        if (contract) {
          await PdfService.generateContractPdf(contract);
          // Storage integration would go here
        }
      } 
      else if (job.name === 'send-email') {
        const { to, subject, body } = job.data;
        await NotificationService.sendEmail(to, subject, body);
      }
      
      console.log(`Job ${job.id} completed successfully`);
    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      throw error; // Let BullMQ handle retries
    }
  });

  worker.on('failed', (job: any, err: Error) => {
    console.error(`Worker failed job ${job?.id}: ${err.message}`);
  });

  console.log('Background job worker started');
  return worker;
};
