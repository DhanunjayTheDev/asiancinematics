import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceTicket extends Document {
  ticketNumber: string;
  user: mongoose.Types.ObjectId;
  service?: mongoose.Types.ObjectId;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: mongoose.Types.ObjectId;
  comments: {
    user: mongoose.Types.ObjectId;
    message: string;
    createdAt: Date;
  }[];
  attachments: string[];
  isDeleted: boolean;
}

const commentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const serviceTicketSchema = new Schema<IServiceTicket>(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    comments: [commentSchema],
    attachments: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

serviceTicketSchema.index({ status: 1, priority: 1 });
serviceTicketSchema.index({ assignedTo: 1, status: 1 });

export default mongoose.model<IServiceTicket>('ServiceTicket', serviceTicketSchema);
