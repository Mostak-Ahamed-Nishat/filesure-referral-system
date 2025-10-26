import express from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticate } from '../../middlewares';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard analytics
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get combined dashboard statistics and chart data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [month, week]
 *         description: Chart view period
 *       - in: query
 *         name: range
 *         schema:
 *           type: integer
 *         description: Number of months/weeks to include
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 */

router.get('/', authenticate, DashboardController.getDashboardData);
export const DashboardRoutes = router;
