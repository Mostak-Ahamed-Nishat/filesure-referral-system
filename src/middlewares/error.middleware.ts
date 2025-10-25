import { Request, Response, NextFunction } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { ApiError, logger } from '../utils';

export const errorMiddleware = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  const status =
    err instanceof ApiError
      ? err.statusCode
      : StatusCodes.INTERNAL_SERVER_ERROR;

  const message =
    err.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);

  const errors = err instanceof ApiError ? err.errors : undefined;

  logger.error(`[${status}] ${message}`, { stack: err.stack });

  return res.status(status).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
