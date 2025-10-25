import express from 'express';
import { CreditController } from './credit.controller';
import { authenticate } from '../../middlewares';

const router = express.Router();

router.get('/test', CreditController.testCredit);
router.post('/', authenticate, CreditController.createCreditTransaction);
router.get('/balance', authenticate, CreditController.getMyCreditBalance);
router.post(
  '/allocate',
  authenticate,
  CreditController.allocateReferralCredits
);

export const CreditRoutes = router;
