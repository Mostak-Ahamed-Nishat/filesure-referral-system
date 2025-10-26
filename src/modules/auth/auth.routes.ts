import express from 'express';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validator';
import { authenticate, validateRequest } from '../../middlewares';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & user management
 */

// Register
router.post(
  '/register',
  validateRequest(AuthValidation.register),
  AuthController.registerUser
);

// Login
router.post(
  '/login',
  validateRequest(AuthValidation.login),
  AuthController.loginUser
);

// Refresh token
router.post('/refresh', AuthController.refreshToken);

// Logout
router.post('/logout', authenticate, AuthController.logoutUser);

export const AuthRoutes = router;
