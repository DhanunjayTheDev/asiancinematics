import mongoose, { Document, Schema } from 'mongoose';

export interface IInquiry extends Document {
  user?: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone: string;
  subject: string;
  message: string;
  budget?: string;
  requirements?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'converted' | 'closed';
  source: 'website' | 'whatsapp' | 'phone' | 'email' | 'other';
  notes?: string;
  assignedTo?: mongoose.Types.ObjectId;
  isDeleted: boolean;
}

const inquirySchema = new Schema<IInquiry>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: false, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true },
    budget: { type: String, trim: true },
    requirements: { type: String },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal_sent', 'converted', 'closed'],
      default: 'new',
      index: true,
    },
    source: {
      type: String,
      enum: ['website', 'whatsapp', 'phone', 'email', 'other'],
      default: 'website',
    },
    notes: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

inquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IInquiry>('Inquiry', inquirySchema);
