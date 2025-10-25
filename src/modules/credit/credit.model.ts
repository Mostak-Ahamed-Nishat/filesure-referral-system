import { Schema, model, Document, Types } from 'mongoose';

export interface TCreditTransaction extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  amount: number;
  type: 'earned' | 'used';
  description: string;
  related_referral_id?: Types.ObjectId;
  related_purchase_id?: Types.ObjectId;
  createdAt: Date;
}

const CreditTransactionSchema = new Schema<TCreditTransaction>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['earned', 'used'], required: true },
    description: { type: String, required: true },
    related_referral_id: { type: Schema.Types.ObjectId, ref: 'Referral' },
    related_purchase_id: { type: Schema.Types.ObjectId, ref: 'Purchase' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const CreditTransaction = model<TCreditTransaction>(
  'CreditTransaction',
  CreditTransactionSchema
);
