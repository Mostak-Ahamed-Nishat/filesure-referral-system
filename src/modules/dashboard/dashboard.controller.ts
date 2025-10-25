import asyncHandler from 'express-async-handler';
import { ApiResponse } from '../../utils';

const testDashboard = asyncHandler(async (_req, res) => {
  ApiResponse.success(res, { message: 'Dashboard module connected' }, 'OK');
});

export const DashboardController = { testDashboard };
