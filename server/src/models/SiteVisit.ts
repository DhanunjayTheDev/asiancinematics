import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteVisit extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  timeSlot: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  purpose: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: mongoose.Types.ObjectId;
  isDeleted: boolean;
}

const siteVisitSchema = new Schema<ISiteVisit>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    purpose: { type: String, required: true, trim: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

siteVisitSchema.index({ date: 1, status: 1 });

export default mongoose.model<ISiteVisit>('SiteVisit', siteVisitSchema);
