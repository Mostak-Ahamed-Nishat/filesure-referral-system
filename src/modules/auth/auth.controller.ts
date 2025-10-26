import asyncHandler from 'express-async-handler';
import { AuthServices } from './auth.service';
import { ApiResponse } from '../../utils';
import { StatusCodes } from 'http-status-codes';

//  Register
const registerUser = asyncHandler(async (req, res) => {
  const result = await AuthServices.registerUserIntoDB(req.body);
  ApiResponse.created(res, result, 'User registered successfully');
});

//  Login
const loginUser = asyncHandler(async (req, res) => {
  const result = await AuthServices.loginUserFromDB(req.body);
  ApiResponse.success(res, result, 'Login successful', StatusCodes.OK);
});

//  Refresh Token
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await AuthServices.refreshAccessToken(refreshToken);
  ApiResponse.success(
    res,
    tokens,
    'Token refreshed successfully',
    StatusCodes.OK
  );
});

//  Logout
const logoutUser = asyncHandler(async (req, res) => {
  const user = (req as any).user;
  const result = await AuthServices.logoutUser(user.id);
  ApiResponse.success(res, result, 'Logout successful', StatusCodes.OK);
});

export const AuthController = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
};
