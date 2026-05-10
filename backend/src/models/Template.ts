import mongoose, { Document, Schema } from 'mongoose';

export interface ITemplate extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  content?: string;
  variables?: any; // JSON array or object
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String },
    variables: { type: Schema.Types.Mixed },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ITemplate>('Template', TemplateSchema);
