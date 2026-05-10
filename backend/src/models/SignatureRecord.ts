import mongoose, { Document, Schema } from 'mongoose';

export interface ISignatureRecord extends Document {
  contractId: mongoose.Types.ObjectId;
  signerName: string;
  signerEmail: string;
  signatureData: string; // base64
  ipAddress?: string;
  userAgent?: string;
  documentHash?: string;
  signedAt: Date;
}

const SignatureRecordSchema: Schema = new Schema(
  {
    contractId: { type: Schema.Types.ObjectId, ref: 'Contract', required: true },
    signerName: { type: String, required: true },
    signerEmail: { type: String, required: true },
    signatureData: { type: String, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    documentHash: { type: String },
    signedAt: { type: Date, default: Date.now },
  }
);

export default mongoose.model<ISignatureRecord>('SignatureRecord', SignatureRecordSchema);
