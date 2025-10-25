import { Referral } from './referral.model';
import { ApiError } from '../../utils';
import { StatusCodes } from 'http-status-codes';

//Create Referral
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

//Get Referral by user
const getReferralsByUserFromDB = async (
  userId: string,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  const referrals = await Referral.find({ referrer_id: userId })
    .populate('referred_user_id', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Referral.countDocuments({ referrer_id: userId });

  return {
    referrals,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    },
  };
};

export const ReferralServices = {
  createReferralIntoDB,
  getReferralsByUserFromDB,
};
