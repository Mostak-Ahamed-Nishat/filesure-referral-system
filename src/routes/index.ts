import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { ReferralRoutes } from '../modules/referral/referral.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/referrals',
    route: ReferralRoutes,
  },
];

moduleRoutes.map((route) => router.use(route.path, route.route));

export default router;
