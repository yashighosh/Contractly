import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import path from 'path';

export class PdfService {
  static async generateContractPdf(contract: any): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const fileName = `contract_${contract._id}_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '../../uploads', fileName);

        doc.pipe(createWriteStream(filePath));

        // Header
        doc.fontSize(20).text('CONTRACT AGREEMENT', { align: 'center' });
        doc.moveDown();

        // Details
        doc.fontSize(12).text(`Contract ID: ${contract._id}`);
        doc.text(`Date Generated: ${new Date().toLocaleDateString()}`);
        doc.moveDown();

        doc.fontSize(14).text(`Client: ${contract.clientName}`);
        doc.moveDown();

        // Body
        doc.fontSize(12).text(contract.content, {
          align: 'justify',
          lineGap: 5
        });

        doc.moveDown(2);

        // Signatures
        if (contract.status === 'signed') {
          doc.fontSize(10).font('Helvetica-Oblique').text('Digitally Signed via Contractly', { align: 'right' });
          doc.text(`Signed Date: ${new Date(contract.signedAt).toLocaleString()}`, { align: 'right' });
          doc.text(`IP Address: ${contract.ipAddress}`, { align: 'right' });
        }

        doc.end();
        resolve(filePath);
      } catch (error) {
        reject(error);
      }
    });
  }
}
