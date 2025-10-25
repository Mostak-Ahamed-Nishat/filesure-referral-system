import { CreditTransaction } from './credit.model';
import { TCreateCreditTransaction } from './credit.interface';
import { ApiError } from '../../utils';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

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

export const CreditServices = {
  createCreditTransactionIntoDB,
  getCreditBalanceFromDB,
};
