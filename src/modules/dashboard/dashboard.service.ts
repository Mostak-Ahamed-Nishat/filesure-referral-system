import { Referral } from '../referral/referral.model';
import { CreditTransaction } from '../credit/credit.model';
import { User } from '../auth/auth.model';
import { ApiError } from '../../utils';
import { StatusCodes } from 'http-status-codes';
import config from '../../config';

const getDashboardStatsFromDB = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  // total referred users
  const totalReferred = await Referral.countDocuments({ referrer_id: userId });

  //  total converted users
  const totalConverted = await Referral.countDocuments({
    referrer_id: userId,
    status: 'converted',
  });

  //  total credits earned
  const totalCreditsData = await CreditTransaction.aggregate([
    { $match: { user_id: user._id, type: 'earned' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const totalCredits = totalCreditsData[0]?.total || 0;

  // referral link
  const referralCode = user.referral_code;
  const referralLink = `${config.FRONTEND_BASE_URL}/register?ref=${referralCode}`;

  return {
    totalReferred,
    totalConverted,
    totalCredits,
    referralCode,
    referralLink,
  };
};

export const DashboardServices = {
  getDashboardStatsFromDB,
};
