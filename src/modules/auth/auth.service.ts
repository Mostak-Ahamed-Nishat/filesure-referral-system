import { User } from './auth.model';
import { TRegisterInput, TLoginInput, TAuthResponse } from './auth.interface';
import { JwtUtil, ApiError } from '../../utils';
import { StatusCodes } from 'http-status-codes';

const registerUserIntoDB = async (
  payload: TRegisterInput
): Promise<TAuthResponse> => {
  const existing = await User.findOne({ email: payload.email });
  if (existing)
    throw new ApiError(StatusCodes.CONFLICT, 'Email already registered');

  const user = await User.create({
    email: payload.email,
    password_hash: payload.password,
    name: payload.name,
    referral_code: '',
  });

  const accessToken = JwtUtil.generateAccessToken({
    id: user._id.toString(),
    email: user.email,
  });

  const refreshToken = JwtUtil.generateRefreshToken({
    id: user._id.toString(),
    email: user.email,
  });

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      referralCode: user.referral_code,
      totalCredits: user.total_credits,
    },
    tokens: { accessToken, refreshToken },
  };
};

const loginUserFromDB = async (
  payload: TLoginInput
): Promise<TAuthResponse> => {
  const user = await User.findOne({ email: payload.email });
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  const valid = await user.comparePassword(payload.password);
  if (!valid)
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');

  const accessToken = JwtUtil.generateAccessToken({
    id: user._id.toString(),
    email: user.email,
  });

  const refreshToken = JwtUtil.generateRefreshToken({
    id: user._id.toString(),
    email: user.email,
  });

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      referralCode: user.referral_code,
      totalCredits: user.total_credits,
    },
    tokens: { accessToken, refreshToken },
  };
};

export const AuthServices = {
  registerUserIntoDB,
  loginUserFromDB,
};
