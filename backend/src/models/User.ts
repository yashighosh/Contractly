import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  fullName: string;
  role: 'ADMIN' | 'USER' | 'AGENCY';
  plan: 'FREE' | 'PRO' | 'AGENCY';
  companyName?: string;
  agencyWebsite?: string;
  teamSize?: string;
  location?: string;
  subscriptionId?: string;
  avatarUrl?: string;
  lastLogin?: Date;
  activeSessions: string[]; // Array of session IDs or JWT identifiers
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true },
    role: { type: String, default: 'USER', enum: ['ADMIN', 'USER', 'AGENCY'] },
    plan: { type: String, default: 'FREE', enum: ['FREE', 'PRO', 'AGENCY'] },
    companyName: { type: String },
    agencyWebsite: { type: String },
    teamSize: { type: String },
    location: { type: String },
    subscriptionId: { type: String },
    avatarUrl: { type: String },
    lastLogin: { type: Date },
    activeSessions: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
