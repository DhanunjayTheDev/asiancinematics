import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  stock: number;
  sku?: string;
  isActive: boolean;
  isDeleted: boolean;
  isFeatured: boolean;
  tags: string[];
  specifications?: Record<string, string>;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, trim: true, maxlength: 300 },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    images: [{ type: String }],
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, trim: true },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false, index: true },
    tags: [{ type: String, trim: true }],
    specifications: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ slug: 1, isDeleted: 1 });
productSchema.index({ category: 1, isActive: 1, isDeleted: 1 });
productSchema.index({ price: 1 });

export default mongoose.model<IProduct>('Product', productSchema);
