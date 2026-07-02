import mongoose, { Document, Schema } from 'mongoose';

interface ILineItem {
  brand: string;
  model: string;
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface IInvoice extends Document {
  invoiceNo: string;
  date: string;
  offerLabel: string;
  offerTitle: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: ILineItem[];
  grandTotal: number;
  notes: string;
  paymentTerms: string;
  validityNote: string;
  authorizedBy: string;
  designation: string;
  createdBy?: mongoose.Types.ObjectId;
  isDeleted: boolean;
}

const lineItemSchema = new Schema<ILineItem>({
  brand: { type: String, default: '' },
  model: { type: String, default: '' },
  description: { type: String, default: '' },
  qty: { type: Number, default: 0 },
  unitPrice: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
}, { _id: false });

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNo: { type: String, required: true, unique: true, trim: true },
    date: { type: String, required: true },
    offerLabel: { type: String, default: '' },
    offerTitle: { type: String, default: '' },
    customerName: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    customerAddress: { type: String, default: '' },
    items: [lineItemSchema],
    grandTotal: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    paymentTerms: { type: String, default: '' },
    validityNote: { type: String, default: '' },
    authorizedBy: { type: String, default: '' },
    designation: { type: String, default: '' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

invoiceSchema.index({ invoiceNo: 1 });
invoiceSchema.index({ createdAt: -1 });

export default mongoose.model<IInvoice>('Invoice', invoiceSchema);
