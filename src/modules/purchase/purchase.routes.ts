import express from 'express';
import { PurchaseController } from './purchase.controller';
import { authenticate } from '../../middlewares';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Purchases
 *   description: Manage user purchases
 */

/**
 * @swagger
 * /purchases:
 *   post:
 *     summary: A user purchase
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Purchase created successfully
 */

/**
 * @swagger
 * /purchases/my:
 *   get:
 *     summary: Get all purchases
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User purchase history fetched
 */

router.get('/test', PurchaseController.testPurchase);
router.post('/', authenticate, PurchaseController.createPurchase);
router.get('/my', authenticate, PurchaseController.getMyPurchases);

export const PurchaseRoutes = router;
