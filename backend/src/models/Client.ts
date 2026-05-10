import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  companyName?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    companyName: { type: String },
    email: { type: String, required: true, trim: true, lowercase: true },
    phoneNumber: { type: String },
    address: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IClient>('Client', ClientSchema);
