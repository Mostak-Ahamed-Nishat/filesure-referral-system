import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface TUser extends Document {
  email: string;
  password_hash: string;
  name: string;
  referral_code: string;
  total_credits: number;
  referred_by?: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<TUser>(
  {
    email: { type: String, required: true, unique: true, trim: true },
    password_hash: { type: String, required: true },
    name: { type: String, required: true },
    referral_code: { type: String, unique: true },
    total_credits: { type: Number, default: 0 },
    referred_by: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// hash password automatically
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();
  const saltRounds = 10;
  this.password_hash = await bcrypt.hash(this.password_hash, saltRounds);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password_hash);
};

export const User = model<TUser>('User', UserSchema);
