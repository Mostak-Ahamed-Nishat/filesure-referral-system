import express from 'express';
import { ReferralController } from './referral.controller';
import { authenticate } from '../../middlewares';

const router = express.Router();

router.get('/test', ReferralController.testReferral);
router.get('/my', authenticate, ReferralController.getMyReferrals);
router.get('/stats', authenticate, ReferralController.getReferralStats);

export const ReferralRoutes = router;
