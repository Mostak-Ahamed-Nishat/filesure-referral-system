import { Schema, model, Document, Types } from 'mongoose';

export interface TReferral extends Document {
  _id: Types.ObjectId;
  referrer_id: Types.ObjectId;
  referred_user_id: Types.ObjectId;
  status: 'pending' | 'converted';
  converted_at?: Date;
}

const ReferralSchema = new Schema<TReferral>(
  {
    referrer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    referred_user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'converted'],
      default: 'pending',
    },
    converted_at: { type: Date },
  },
  { timestamps: true }
);

export const Referral = model<TReferral>('Referral', ReferralSchema);
