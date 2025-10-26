import { Schema, model, Document, Types } from 'mongoose';

export interface TPurchase extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  is_first_purchase: boolean;
  status: 'completed' | 'cancelled';
  createdAt: Date;
}

const PurchaseSchema = new Schema<TPurchase>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    is_first_purchase: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['completed', 'cancelled'],
      default: 'completed',
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Purchase = model<TPurchase>('Purchase', PurchaseSchema);
