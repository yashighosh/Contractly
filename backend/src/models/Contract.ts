import mongoose, { Document, Schema } from 'mongoose';

export interface IContract extends Document {
  userId: mongoose.Types.ObjectId;
  clientId?: mongoose.Types.ObjectId;
  templateId?: mongoose.Types.ObjectId;
  title: string;
  content?: string;
  variablesData?: any; // JSON object
  status: string; // DRAFT, SENT, VIEWED, SIGNED, EXPIRED
  recipientName?: string;
  recipientEmail?: string;
  amount?: number;
  currency?: string;
  startDate?: Date;
  endDate?: Date;
  recurring: boolean;
  renewalPeriodDays?: number;
  autoRenew: boolean;
  signToken?: string;
  signTokenExpiry?: Date;
  signedPdfKey?: string;
  sentAt?: Date;
  viewedAt?: Date;
  signedAt?: Date;
  expiredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
    templateId: { type: Schema.Types.ObjectId, ref: 'Template' },
    title: { type: String, required: true },
    content: { type: String },
    variablesData: { type: Schema.Types.Mixed },
    status: { type: String, default: 'DRAFT', enum: ['DRAFT', 'SENT', 'VIEWED', 'SIGNED', 'EXPIRED'] },
    recipientName: { type: String },
    recipientEmail: { type: String },
    amount: { type: Number },
    currency: { type: String, default: 'USD' },
    startDate: { type: Date },
    endDate: { type: Date },
    recurring: { type: Boolean, default: false },
    renewalPeriodDays: { type: Number },
    autoRenew: { type: Boolean, default: false },
    signToken: { type: String },
    signTokenExpiry: { type: Date },
    signedPdfKey: { type: String },
    sentAt: { type: Date },
    viewedAt: { type: Date },
    signedAt: { type: Date },
    expiredAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IContract>('Contract', ContractSchema);
