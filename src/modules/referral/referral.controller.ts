import asyncHandler from 'express-async-handler';
import { ApiResponse } from '../../utils';

const testReferral = asyncHandler(async (_req, res) => {
  ApiResponse.success(res, { message: 'Referral route working' }, 'OK');
});

export const ReferralController = { testReferral };
