import express from 'express';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validator';
import { validateRequest } from '../../middlewares/validateRequest.middleware';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.register),
  AuthController.registerUser
);
router.post(
  '/login',
  validateRequest(AuthValidation.login),
  AuthController.loginUser
);

export const AuthRoutes = router;
