import express from 'express';
import { PurchaseController } from './purchase.controller';
import { authenticate } from '../../middlewares';

const router = express.Router();

router.get('/test', PurchaseController.testPurchase);
router.post('/', authenticate, PurchaseController.createPurchase);
router.get('/my', authenticate, PurchaseController.getMyPurchases);

export const PurchaseRoutes = router;
