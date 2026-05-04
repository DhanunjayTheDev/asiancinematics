import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceRequest extends Document {
  user?: mongoose.Types.ObjectId;
  product: string;
  name: string;
  location: string;
  timeline?: string;
  reference?: string;
  brand?: string;
  budget?: string;
  
  // Room Details
  roomSize?: string;
  length?: number;
  width?: number;
  height?: number;
  dedicatedHT?: string;
  livingRoomHT?: string;
  
  // Speaker Preferences
  towers?: string;
  inwalls?: string;
  inceilings?: string;
  onwalls?: string;
  needAtmos?: string;
  
  // Setup Type
  setupType?: string;
  
  // Display/Video
  projector?: string;
  tv?: string;
  
  // Other Details
  preferredBrands?: string;
  targetBudget?: string;
  duration?: string;
  
  // Status and tracking
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'converted' | 'closed';
  notes?: string;
  assignedTo?: mongoose.Types.ObjectId;
  isDeleted: boolean;
}

const serviceRequestSchema = new Schema<IServiceRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    product: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    timeline: { type: String, trim: true },
    reference: { type: String, trim: true },
    brand: { type: String, trim: true },
    budget: { type: String, trim: true },
    
    // Room Details
    roomSize: { type: String },
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    dedicatedHT: { type: String },
    livingRoomHT: { type: String },
    
    // Speaker Preferences
    towers: { type: String },
    inwalls: { type: String },
    inceilings: { type: String },
    onwalls: { type: String },
    needAtmos: { type: String },
    
    // Setup Type
    setupType: { type: String },
    
    // Display/Video
    projector: { type: String },
    tv: { type: String },
    
    // Other Details
    preferredBrands: { type: String },
    targetBudget: { type: String },
    duration: { type: String },
    
    // Status and tracking
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
serviceRequestSchema.index({ assignedTo: 1, status: 1 });

export default mongoose.model<IServiceRequest>('ServiceRequest', serviceRequestSchema);
