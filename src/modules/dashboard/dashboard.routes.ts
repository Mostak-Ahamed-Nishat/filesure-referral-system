import express from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticate } from '../../middlewares';

const router = express.Router();

router.get('/', authenticate, DashboardController.getDashboardData);
export const DashboardRoutes = router;
