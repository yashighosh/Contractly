import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  contractId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    contractId: { type: Schema.Types.ObjectId, ref: 'Contract' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    metadata: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
  }
);

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
