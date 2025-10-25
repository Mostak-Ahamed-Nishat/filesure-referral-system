import { Purchase } from './purchase.model';
import { TCreatePurchase } from './purchase.interface';
import { ApiError } from '../../utils';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

const createPurchaseIntoDB = async (payload: TCreatePurchase) => {
  // validate userId
  if (!payload.userId || !mongoose.isValidObjectId(payload.userId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid userId');
  }

  // Check user first purchase
  const previousPurchase = await Purchase.findOne({ user_id: payload.userId });

  const isFirstPurchase = !previousPurchase;

  // purchase record
  const purchase = await Purchase.create({
    user_id: payload.userId,
    is_first_purchase: isFirstPurchase,
    status: payload.status || 'completed',
  });

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
