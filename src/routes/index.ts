import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { ReferralRoutes } from '../modules/referral/referral.routes';
import { CreditRoutes } from '../modules/credit/credit.routes';
import { PurchaseRoutes } from '../modules/purchase/purchase.routes';
import { DashboardRoutes } from '../modules/dashboard/dashboard.routes';

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
  {
    path: '/credits',
    route: CreditRoutes,
  },
  {
    path: '/purchases',
    route: PurchaseRoutes,
  },
  {
    path: '/dashboard',
    route: DashboardRoutes,
  },
];

moduleRoutes.map((route) => router.use(route.path, route.route));

export default router;
