import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils';
import { StatusCodes } from 'http-status-codes';

export const validateRequest =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Validation failed', errors);
    }
    next();
  };
