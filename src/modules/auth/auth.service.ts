import { User } from './auth.model';
import { TRegisterInput, TLoginInput, TAuthResponse } from './auth.interface';
import { JwtUtil, ApiError, ReferralCodeUtil } from '../../utils';
import { StatusCodes } from 'http-status-codes';
import { ReferralServices } from '../referral/referral.service';

//unique referral code checker
const generateUniqueReferralCode = async (): Promise<string> => {
  let code = ReferralCodeUtil.generate(8);
  let exists = await User.findOne({ referral_code: code });
  while (exists) {
    code = ReferralCodeUtil.generate(8);
    exists = await User.findOne({ referral_code: code });
  }
  return code;
};

const registerUserIntoDB = async (
  payload: TRegisterInput
): Promise<TAuthResponse> => {
  const existing = await User.findOne({ email: payload.email });
  if (existing)
    throw new ApiError(StatusCodes.CONFLICT, 'Email already registered');

  //referral code
  const referralCode = await generateUniqueReferralCode();

  // check if referred by someone
  let referredById: string | undefined = undefined;

  if (payload.referralCode) {
    const referrer = await User.findOne({
      referral_code: payload.referralCode,
    });
    if (!referrer) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid referral code');
    }
    referredById = referrer._id.toString();
  }

  const user = await User.create({
    email: payload.email,
    password_hash: payload.password,
    name: payload.name,
    referral_code: referralCode,
    referred_by: referredById,
  });

  //  referral record
  if (referredById) {
    await ReferralServices.createReferralIntoDB(
      referredById,
      user._id.toString()
    );
  }

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
