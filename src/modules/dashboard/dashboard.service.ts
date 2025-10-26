import { Referral } from '../referral/referral.model';
import { CreditTransaction } from '../credit/credit.model';
import { User } from '../auth/auth.model';
import { ApiError } from '../../utils';
import { StatusCodes } from 'http-status-codes';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import mongoose from 'mongoose';
import config from '../../config';

dayjs.extend(weekOfYear);

const getDashboardStatsFromDB = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  const totalReferred = await Referral.countDocuments({ referrer_id: userId });
  const totalConverted = await Referral.countDocuments({
    referrer_id: userId,
    status: 'converted',
  });

  const totalCreditsData = await CreditTransaction.aggregate([
    { $match: { user_id: user._id, type: 'earned' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const totalCredits = totalCreditsData[0]?.total || 0;
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

const getChartDataFromDB = async (
  userId: string,
  period: 'month' | 'week' = 'month',
  range: number = 6
) => {
  const now = dayjs();

  const end = period === 'month' ? now.endOf('month') : now.endOf('week');
  const start =
    period === 'month'
      ? end.subtract(range - 1, 'month').startOf('month')
      : end.subtract(range - 1, 'week').startOf('week');

  const referredAgg = await Referral.aggregate([
    {
      $match: {
        referrer_id: new mongoose.Types.ObjectId(userId),
        created_at: { $gte: start.toDate(), $lte: end.toDate() },
      },
    },
    {
      $group: {
        _id:
          period === 'month'
            ? { $month: '$created_at' }
            : { $isoWeek: '$created_at' },
        count: { $sum: 1 },
      },
    },
  ]);

  const convertedAgg = await Referral.aggregate([
    {
      $match: {
        referrer_id: new mongoose.Types.ObjectId(userId),
        status: 'converted',
        converted_at: { $gte: start.toDate(), $lte: end.toDate() },
      },
    },
    {
      $group: {
        _id:
          period === 'month'
            ? { $month: '$converted_at' }
            : { $isoWeek: '$converted_at' },
        count: { $sum: 1 },
      },
    },
  ]);

  const labels = [];
  for (let i = range - 1; i >= 0; i--) {
    const d =
      period === 'month' ? now.subtract(i, 'month') : now.subtract(i, 'week');
    labels.push({
      label: period === 'month' ? d.format('MMM') : `Wk${d.week()}`,
      num: period === 'month' ? d.month() + 1 : d.week(),
    });
  }

  return labels.map(({ label, num }) => ({
    period: label,
    referred: referredAgg.find((r) => r._id === num)?.count || 0,
    converted: convertedAgg.find((c) => c._id === num)?.count || 0,
  }));
};

export const DashboardServices = {
  getDashboardStatsFromDB,
  getChartDataFromDB,
};
