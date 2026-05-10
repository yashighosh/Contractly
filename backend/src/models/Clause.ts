import mongoose, { Document, Schema } from 'mongoose';

export interface IClause extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  category?: string; // e.g., "payment_terms", "ip_ownership", "nda"
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClauseSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IClause>('Clause', ClauseSchema);
