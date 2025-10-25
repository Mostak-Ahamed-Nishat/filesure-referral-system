import asyncHandler from 'express-async-handler';
import { ApiResponse, ReferralCodeUtil } from '../../utils';
import { ReferralServices } from './referral.service';
import { StatusCodes } from 'http-status-codes';

//Test
const testReferral = asyncHandler(async (_req, res) => {
  const code = ReferralCodeUtil.generate(8);
  ApiResponse.success(res, { referralCode: code }, 'Generated referral code');
});

// Get My Referral
const getMyReferrals = asyncHandler(async (req, res) => {
  const user = (req as any).user;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await ReferralServices.getReferralsByUserFromDB(
    user.id,
    page,
    limit
  );
  ApiResponse.success(
    res,
    result,
    'Referrals fetched successfully',
    StatusCodes.OK
  );
});

export const ReferralController = { testReferral, getMyReferrals };
