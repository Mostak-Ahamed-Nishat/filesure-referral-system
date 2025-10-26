import { User } from './auth.model';
import { TRegisterInput, TLoginInput, TAuthResponse } from './auth.interface';
import { JwtUtil, ApiError, ReferralCodeUtil } from '../../utils';
import { StatusCodes } from 'http-status-codes';
import { ReferralServices } from '../referral/referral.service';

// Generate a unique referral code for each user
const generateUniqueReferralCode = async (): Promise<string> => {
  let code = ReferralCodeUtil.generate(8);
  let exists = await User.findOne({ referral_code: code });
  while (exists) {
    code = ReferralCodeUtil.generate(8);
    exists = await User.findOne({ referral_code: code });
  }
  return code;
};

// Helper to issue both tokens
const issueTokens = (user: any) => {
  const accessToken = JwtUtil.generateAccessToken({
    id: user._id.toString(),
    email: user.email,
  });
  const refreshToken = JwtUtil.generateRefreshToken({
    id: user._id.toString(),
    email: user.email,
  });
  return { accessToken, refreshToken };
};

//  Register
const registerUserIntoDB = async (
  payload: TRegisterInput
): Promise<TAuthResponse> => {
  const existing = await User.findOne({ email: payload.email });
  if (existing)
    throw new ApiError(StatusCodes.CONFLICT, 'Email already registered');

  const referralCode = await generateUniqueReferralCode();

  // if referred by someone
  let referredById: string | undefined = undefined;

  if (payload.referralCode) {
    const referrer = await User.findOne({
      referral_code: payload.referralCode,
    });
    if (!referrer)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid referral code');
    referredById = referrer._id.toString();
  }

  const user = await User.create({
    email: payload.email,
    password_hash: payload.password,
    name: payload.name,
    referral_code: referralCode,
    referred_by: referredById,
  });

  // create referral relationship
  if (referredById) {
    await ReferralServices.createReferralIntoDB(
      referredById,
      user._id.toString()
    );
  }

  const tokens = issueTokens(user);
  user.refresh_token = tokens.refreshToken;
  await user.save();

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      referralCode: user.referral_code,
      totalCredits: user.total_credits,
    },
    tokens,
  };
};

// 🔑 Login
const loginUserFromDB = async (
  payload: TLoginInput
): Promise<TAuthResponse> => {
  const user = await User.findOne({ email: payload.email });
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  const valid = await user.comparePassword(payload.password);
  if (!valid)
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');

  const tokens = issueTokens(user);
  user.refresh_token = tokens.refreshToken;
  await user.save();

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      referralCode: user.referral_code,
      totalCredits: user.total_credits,
    },
    tokens,
  };
};

// Refresh token
const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken)
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token missing');

  const decoded = JwtUtil.verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  // validate refresh token
  if (user.refresh_token !== refreshToken)
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token');

  const newTokens = issueTokens(user);
  user.refresh_token = newTokens.refreshToken;
  await user.save();

  return newTokens;
};

// Logout
const logoutUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  user.refresh_token = null;
  await user.save();
  return { message: 'Logged out successfully' };
};

export const AuthServices = {
  registerUserIntoDB,
  loginUserFromDB,
  refreshAccessToken,
  logoutUser,
};
