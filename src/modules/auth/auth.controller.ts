import asyncHandler from 'express-async-handler';
import { AuthServices } from './auth.service';
import { ApiResponse } from '../../utils';
import { StatusCodes } from 'http-status-codes';

const registerUser = asyncHandler(async (req, res) => {
  const result = await AuthServices.registerUserIntoDB(req.body);
  ApiResponse.created(res, result, 'User registered successfully');
});

const loginUser = asyncHandler(async (req, res) => {
  const result = await AuthServices.loginUserFromDB(req.body);
  ApiResponse.success(res, result, 'Login successful', StatusCodes.OK);
});

export const AuthController = { registerUser, loginUser };
