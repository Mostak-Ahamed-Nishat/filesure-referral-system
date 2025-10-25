import express from 'express';
import { ReferralController } from './referral.controller';

const router = express.Router();

router.get('/test', ReferralController.testReferral);

export const ReferralRoutes = router;
