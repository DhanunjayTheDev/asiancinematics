import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  icon?: string;
  image?: string;
  price?: number;
  isActive: boolean;
  isDeleted: boolean;
  sortOrder: number;
}

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, trim: true, maxlength: 300 },
    icon: { type: String },
    image: { type: String },
    price: { type: Number, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

serviceSchema.index({ slug: 1, isDeleted: 1 });

export default mongoose.model<IService>('Service', serviceSchema);
