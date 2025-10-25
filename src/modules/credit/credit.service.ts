import { CreditTransaction } from './credit.model';
import { TCreateCreditTransaction } from './credit.interface';
import { ApiError, withTransaction } from '../../utils';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { User } from '../auth/auth.model';
import { Referral } from '../referral/referral.model';

// Create Credit
const createCreditTransactionIntoDB = async (
  payload: TCreateCreditTransaction
) => {
  if (!payload.amount || payload.amount <= 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid credit amount');
  }

  const transaction = await CreditTransaction.create({
    user_id: new mongoose.Types.ObjectId(payload.userId),
    amount: payload.amount,
    type: payload.type,
    description: payload.description,
    related_referral_id: payload.relatedReferralId,
    related_purchase_id: payload.relatedPurchaseId,
  });

  return transaction;
};

// user’s current balance
const getCreditBalanceFromDB = async (userId: string) => {
  const earned = await CreditTransaction.aggregate([
    {
      $match: { user_id: new mongoose.Types.ObjectId(userId), type: 'earned' },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const used = await CreditTransaction.aggregate([
    { $match: { user_id: new mongoose.Types.ObjectId(userId), type: 'used' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const totalEarned = earned[0]?.total || 0;
  const totalUsed = used[0]?.total || 0;

  return { totalCredits: totalEarned - totalUsed };
};

// Allocate the credits to the both user

const allocateReferralCredits = async (
  referrerId: string,
  refereeId: string,
  referralId: string
) => {
  return withTransaction(async (session) => {
    //  credit for referrer
    await CreditTransaction.create(
      [
        {
          user_id: new mongoose.Types.ObjectId(referrerId),
          amount: 2,
          type: 'earned',
          description: 'Referral reward (referrer)',
          related_referral_id: new mongoose.Types.ObjectId(referralId),
        },
      ],
      { session }
    );

    //  credit for referee
    await CreditTransaction.create(
      [
        {
          user_id: new mongoose.Types.ObjectId(refereeId),
          amount: 2,
          type: 'earned',
          description: 'Referral reward (referee)',
          related_referral_id: new mongoose.Types.ObjectId(referralId),
        },
      ],
      { session }
    );

    // credits for both users
    await User.updateMany(
      { _id: { $in: [referrerId, refereeId] } },
      { $inc: { total_credits: 2 } },
      { session }
    );

    //  referral converted
    await Referral.findByIdAndUpdate(
      referralId,
      { status: 'converted', converted_at: new Date() },
      { session }
    );

    return { referrerCredits: 2, refereeCredits: 2 };
  });
};

export const CreditServices = {
  createCreditTransactionIntoDB,
  getCreditBalanceFromDB,
  allocateReferralCredits,
};
