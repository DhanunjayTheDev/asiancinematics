import mongoose, { Document, Schema } from 'mongoose';

export interface IRegistration extends Document {
  type: 'partner' | 'freelancer' | 'employee';
  status: 'pending' | 'approved' | 'rejected';
  name: string;
  email: string;
  phone: string;
  city: string;
  // Partner fields
  company?: string;
  partnerType?: string;
  // Freelancer fields
  skills?: string[];
  portfolio?: string;
  availability?: string;
  // Employee fields
  position?: string;
  qualification?: string;
  resumeLink?: string;
  // Common
  experience?: string;
  message?: string;
  rejectionReason?: string;
  approvedUserId?: mongoose.Types.ObjectId;
  isDeleted: boolean;
}

const registrationSchema = new Schema<IRegistration>(
  {
    type: { type: String, enum: ['partner', 'freelancer', 'employee'], required: true, index: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    // Partner
    company: { type: String, trim: true },
    partnerType: { type: String, trim: true },
    // Freelancer
    skills: [{ type: String }],
    portfolio: { type: String, trim: true },
    availability: { type: String, trim: true },
    // Employee
    position: { type: String, trim: true },
    qualification: { type: String, trim: true },
    resumeLink: { type: String, trim: true },
    // Common
    experience: { type: String, trim: true },
    message: { type: String, trim: true },
    rejectionReason: { type: String, trim: true },
    approvedUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IRegistration>('Registration', registrationSchema);
