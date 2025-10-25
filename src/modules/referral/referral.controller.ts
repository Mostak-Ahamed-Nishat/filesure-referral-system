import asyncHandler from 'express-async-handler';
import { ApiResponse, ReferralCodeUtil } from '../../utils';

const testReferral = asyncHandler(async (_req, res) => {
  const code = ReferralCodeUtil.generate(8);
  ApiResponse.success(res, { referralCode: code }, 'Generated referral code');
});

export const ReferralController = { testReferral };
