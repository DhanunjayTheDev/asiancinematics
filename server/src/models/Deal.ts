import mongoose, { Document, Schema } from 'mongoose';

export type DealType = 'special_offer' | 'today_deal' | 'clearance_sale' | 'festival_offer' | 'combo_package' | 'refurbished';

export interface IDeal extends Document {
  type: DealType;
  name: string;
  description?: string;
  products: mongoose.Types.ObjectId[];
  isActive: boolean;
  isDeleted: boolean;
  startDate?: Date;
  endDate?: Date;
}

const dealSchema = new Schema<IDeal>(
  {
    type: {
      type: String,
      required: true,
      enum: ['special_offer', 'today_deal', 'clearance_sale', 'festival_offer', 'combo_package', 'refurbished'],
    },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

dealSchema.index({ type: 1, isActive: 1, isDeleted: 1 });

export default mongoose.model<IDeal>('Deal', dealSchema);
