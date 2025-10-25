import asyncHandler from 'express-async-handler';
import { ApiResponse } from '../../utils';
import { CreditServices } from './credit.service';
import { StatusCodes } from 'http-status-codes';

//Test
const testCredit = asyncHandler(async (_req, res) => {
  ApiResponse.success(res, { message: 'Credit module connected' }, 'OK');
});

//Create credit
const createCreditTransaction = asyncHandler(async (req, res) => {
  const result = await CreditServices.createCreditTransactionIntoDB(req.body);
  ApiResponse.created(res, result, 'Credit transaction created successfully');
});

//Get Credit balance
const getMyCreditBalance = asyncHandler(async (req, res) => {
  const user = (req as any).user;
  const result = await CreditServices.getCreditBalanceFromDB(user.id);
  ApiResponse.success(res, result, 'Credit balance fetched', StatusCodes.OK);
});

export const CreditController = {
  testCredit,
  createCreditTransaction,
  getMyCreditBalance,
};
