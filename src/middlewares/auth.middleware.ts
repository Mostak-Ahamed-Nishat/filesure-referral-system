import { Request, Response, NextFunction } from 'express';
import { JwtUtil, ApiError } from '../utils';
import { StatusCodes } from 'http-status-codes';

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      'Authorization header missing'
    );
  }

  const token = header.split(' ')[1];
  const payload = JwtUtil.verifyAccessToken(token);
  (req as any).user = payload;
  next();
};
