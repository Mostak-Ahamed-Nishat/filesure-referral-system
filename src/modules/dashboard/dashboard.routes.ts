import express from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticate } from '../../middlewares';

const router = express.Router();

router.get('/test', authenticate, DashboardController.testDashboard);
router.get('/stats', authenticate, DashboardController.getDashboardStats);
export const DashboardRoutes = router;
