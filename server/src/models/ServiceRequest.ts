import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceRequest extends Document {
  user?: mongoose.Types.ObjectId;
  formType: string; // 'security', 'home-automation', 'home-theater', etc.

  // Common fields
  name: string;
  contact: string;
  state?: string;
  district?: string;
  address?: string;
  categories?: string[]; // Client, Architect, Interior, Referral, etc.

  // Security-specific (and reused in others)
  systemType?: string;
  serviceRequestType?: string; // Immediate Service, General Inquiry, etc.
  serviceAmount?: number;
  startDate?: Date;
  specs?: string;
  needsDiscussion?: boolean;

  // Legacy fields kept for backward compat
  product?: string;
  location?: string;
  timeline?: string;
  reference?: string;
  brand?: string;
  budget?: string;
  roomSize?: string;
  length?: number;
  width?: number;
  height?: number;
  dedicatedHT?: string;
  livingRoomHT?: string;
  towers?: string;
  inwalls?: string;
  inceilings?: string;
  onwalls?: string;
  needAtmos?: string;
  setupType?: string;
  projector?: string;
  tv?: string;
  preferredBrands?: string;
  targetBudget?: string;
  duration?: string;

  // Payment
  paymentStatus: 'pending' | 'submitted' | 'verified' | 'rejected';
  utrNumber?: string;
  paymentScreenshot?: string;

  // Status and tracking
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'converted' | 'closed';
  notes?: string;
  assignedTo?: mongoose.Types.ObjectId;
  isDeleted: boolean;
}

const serviceRequestSchema = new Schema<IServiceRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    formType: { type: String, default: 'legacy', trim: true },

    name: { type: String, required: true, trim: true },
    contact: { type: String, trim: true },
    state: { type: String, trim: true },
    district: { type: String, trim: true },
    address: { type: String, trim: true },
    categories: [{ type: String }],

    systemType: { type: String, trim: true },
    serviceRequestType: { type: String, trim: true },
    serviceAmount: { type: Number },
    startDate: { type: Date },
    specs: { type: String, trim: true },
    needsDiscussion: { type: Boolean, default: false },

    // Legacy
    product: { type: String, trim: true },
    location: { type: String, trim: true },
    timeline: { type: String, trim: true },
    reference: { type: String, trim: true },
    brand: { type: String, trim: true },
    budget: { type: String, trim: true },
    roomSize: { type: String },
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    dedicatedHT: { type: String },
    livingRoomHT: { type: String },
    towers: { type: String },
    inwalls: { type: String },
    inceilings: { type: String },
    onwalls: { type: String },
    needAtmos: { type: String },
    setupType: { type: String },
    projector: { type: String },
    tv: { type: String },
    preferredBrands: { type: String },
    targetBudget: { type: String },
    duration: { type: String },

    // Payment
    paymentStatus: {
      type: String,
      enum: ['pending', 'submitted', 'verified', 'rejected'],
      default: 'pending',
    },
    utrNumber: { type: String, trim: true },
    paymentScreenshot: { type: String, trim: true },

    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal_sent', 'converted', 'closed'],
      default: 'new',
      index: true,
    },
    notes: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

serviceRequestSchema.index({ status: 1, createdAt: -1 });
serviceRequestSchema.index({ formType: 1, paymentStatus: 1 });

export default mongoose.model<IServiceRequest>('ServiceRequest', serviceRequestSchema);
