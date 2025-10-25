import { Referral } from './referral.model';
import { ApiError } from '../../utils';
import { StatusCodes } from 'http-status-codes';

const createReferralIntoDB = async (
  referrerId: string,
  referredUserId: string
) => {
  // prevent self-referral
  if (referrerId === referredUserId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Users cannot refer themselves'
    );
  }

  // prevent duplicate referrals for same user
  const existing = await Referral.findOne({ referred_user_id: referredUserId });
  if (existing) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      'Referral already exists for this user'
    );
  }

  const referral = await Referral.create({
    referrer_id: referrerId,
    referred_user_id: referredUserId,
    status: 'pending',
  });

  return referral;
};

export const ReferralServices = { createReferralIntoDB };
