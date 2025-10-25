import asyncHandler from 'express-async-handler';
import { ApiResponse } from '../../utils';
import { PurchaseServices } from './purchase.service';
import { StatusCodes } from 'http-status-codes';

const testPurchase = asyncHandler(async (_req, res) => {
  ApiResponse.success(res, { message: 'Purchase module connected' }, 'OK');
});

const createPurchase = asyncHandler(async (req, res) => {
  const user = (req as any).user;
  const result = await PurchaseServices.createPurchaseIntoDB({
    userId: user.id,
  });
  ApiResponse.created(res, result, 'Purchase created successfully');
});

const getMyPurchases = asyncHandler(async (req, res) => {
  const user = (req as any).user;
  const result = await PurchaseServices.getPurchasesByUserFromDB(user.id);
  ApiResponse.success(res, result, 'Purchase history fetched', StatusCodes.OK);
});

export const PurchaseController = {
  testPurchase,
  createPurchase,
  getMyPurchases,
};
