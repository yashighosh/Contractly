import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  fullName: string;
  companyName?: string;
  role: string;
  plan: 'FREE' | 'PRO' | 'TEAM';
  subscriptionId?: string;
  avatarUrl?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true },
    companyName: { type: String },
    role: { type: String, default: 'USER', enum: ['ADMIN', 'USER'] },
    plan: { type: String, default: 'FREE', enum: ['FREE', 'PRO', 'TEAM'] },
    subscriptionId: { type: String },
    avatarUrl: { type: String },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
