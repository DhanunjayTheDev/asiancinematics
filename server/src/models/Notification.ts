import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'order' | 'ticket' | 'visit' | 'inquiry' | 'system' | 'assignment';
  refModel?: string;
  refId?: mongoose.Types.ObjectId;
  isRead: boolean;
  channel: 'in_app' | 'email' | 'whatsapp';
  deliveryStatus: 'pending' | 'sent' | 'failed';
  error?: string;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['order', 'ticket', 'visit', 'inquiry', 'system', 'assignment'],
      required: true,
    },
    refModel: { type: String },
    refId: { type: Schema.Types.ObjectId },
    isRead: { type: Boolean, default: false, index: true },
    channel: {
      type: String,
      enum: ['in_app', 'email', 'whatsapp'],
      default: 'in_app',
    },
    deliveryStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
    error: { type: String },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', notificationSchema);
