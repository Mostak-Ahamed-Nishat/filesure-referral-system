import asyncHandler from 'express-async-handler';
import { ApiResponse } from '../../utils';
import { DashboardServices } from './dashboard.service';
import { StatusCodes } from 'http-status-codes';

const testDashboard = asyncHandler(async (_req, res) => {
  ApiResponse.success(res, { message: 'Dashboard module connected' }, 'OK');
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const user = (req as any).user;
  const result = await DashboardServices.getDashboardStatsFromDB(user.id);
  ApiResponse.success(res, result, 'Dashboard stats fetched', StatusCodes.OK);
});

export const DashboardController = {
  testDashboard,
  getDashboardStats,
};
