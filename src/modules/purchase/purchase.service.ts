import { Purchase } from './purchase.model';
import { TCreatePurchase } from './purchase.interface';
import { ApiError } from '../../utils';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { User } from '../auth/auth.model';
import { CreditServices } from '../credit/credit.service';
import { Referral } from '../referral/referral.model';

const createPurchaseIntoDB = async (payload: TCreatePurchase) => {
  if (!payload.userId || !mongoose.isValidObjectId(payload.userId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid userId');
  }

  //  Check user’s first purchase
  const previousPurchase = await Purchase.findOne({ user_id: payload.userId });
  const isFirstPurchase = !previousPurchase;

  //  purchase record
  const purchase = await Purchase.create({
    user_id: payload.userId,
    is_first_purchase: isFirstPurchase,
    status: payload.status || 'completed',
  });

  // give credit on first purchase
  if (isFirstPurchase) {
    const user = await User.findById(payload.userId);
    if (user?.referred_by) {
      const referral = await Referral.findOne({
        referrer_id: user.referred_by,
        referred_user_id: user._id,
      });

      if (referral && referral.status === 'pending') {
        await CreditServices.allocateReferralCredits(
          user.referred_by.toString(),
          user._id.toString(),
          referral._id.toString()
        );
      }
    }
  }

  return purchase;
};

//  Get purchase history
const getPurchasesByUserFromDB = async (userId: string) => {
  const purchases = await Purchase.find({ user_id: userId })
    .sort({ createdAt: -1 })
    .lean();

  return purchases;
};

export const PurchaseServices = {
  createPurchaseIntoDB,
  getPurchasesByUserFromDB,
};
