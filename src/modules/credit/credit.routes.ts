import express from 'express';
import { CreditController } from './credit.controller';
import { authenticate } from '../../middlewares';

const router = express.Router();

router.get('/test', CreditController.testCredit);
router.post('/', authenticate, CreditController.createCreditTransaction);
router.get('/balance', authenticate, CreditController.getMyCreditBalance);

export const CreditRoutes = router;
