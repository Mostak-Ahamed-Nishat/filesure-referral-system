import asyncHandler from 'express-async-handler';
import { ApiResponse } from '../../utils';
import { DashboardServices } from './dashboard.service';
import { StatusCodes } from 'http-status-codes';

const getDashboardData = asyncHandler(async (req, res) => {
  const user = (req as any).user;
  const period = (req.query.period as 'month' | 'week') || 'month';
  const range = req.query.range
    ? Number(req.query.range)
    : period === 'month'
      ? 6
      : 8;

  const [stats, chartData] = await Promise.all([
    DashboardServices.getDashboardStatsFromDB(user.id),
    DashboardServices.getChartDataFromDB(user.id, period, range),
  ]);

  ApiResponse.success(
    res,
    { stats, chartData, period, range },
    'Dashboard data fetched successfully',
    StatusCodes.OK
  );
});

export const DashboardController = {
  getDashboardData,
};
