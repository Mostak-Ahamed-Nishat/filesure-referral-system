import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';
import { ApiError } from './ApiError.util';
import { StatusCodes } from 'http-status-codes';

export interface JwtPayload {
  id: string;
  email: string;
}

export class JwtUtil {
  static generateAccessToken(payload: JwtPayload): string {
    if (!config.JWT_ACCESS_SECRET) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'JWT access secret missing'
      );
    }

    const options: SignOptions = {
      expiresIn: config.JWT_ACCESS_EXPIRE as unknown as number,
    };

    return jwt.sign(payload, config.JWT_ACCESS_SECRET as jwt.Secret, options);
  }

  static generateRefreshToken(payload: JwtPayload): string {
    if (!config.JWT_REFRESH_SECRET) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'JWT refresh secret missing'
      );
    }

    const options: SignOptions = {
      expiresIn: config.JWT_REFRESH_EXPIRE as unknown as number,
    };

    return jwt.sign(payload, config.JWT_REFRESH_SECRET as jwt.Secret, options);
  }

  static verifyAccessToken(token: string): JwtPayload {
    if (!config.JWT_ACCESS_SECRET) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'JWT access secret missing'
      );
    }

    try {
      return jwt.verify(
        token,
        config.JWT_ACCESS_SECRET as jwt.Secret
      ) as JwtPayload;
    } catch {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Invalid or expired access token'
      );
    }
  }

  static verifyRefreshToken(token: string): JwtPayload {
    if (!config.JWT_REFRESH_SECRET) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'JWT refresh secret missing'
      );
    }

    try {
      return jwt.verify(
        token,
        config.JWT_REFRESH_SECRET as jwt.Secret
      ) as JwtPayload;
    } catch {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Invalid or expired refresh token'
      );
    }
  }
}
