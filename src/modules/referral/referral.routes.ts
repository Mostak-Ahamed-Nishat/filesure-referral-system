import express from 'express';
import { ReferralController } from './referral.controller';
import { authenticate } from '../../middlewares';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Referrals
 *   description: Manage and track referral
 */

/**
 * @swagger
 * /referrals/my-code:
 *   get:
 *     summary: Get referral code and shareable link
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral code fetched successfully
 */

/**
 * @swagger
 * /referrals/stats:
 *   get:
 *     summary: Get referral statistics
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral stats fetched successfully
 */

/**
 * @swagger
 * /referrals/list:
 *   get:
 *     summary: Get a paginated list of referred users
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Referred users list fetched successfully
 */

router.get('/test', ReferralController.testReferral);
router.get('/my', authenticate, ReferralController.getMyReferrals);
router.get('/stats', authenticate, ReferralController.getReferralStats);

export const ReferralRoutes = router;
