import { StatusCodes } from 'http-status-codes';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config';
import { errorMiddleware } from './middlewares';
import { ApiError } from './utils';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
app.use(
  rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX_REQUESTS,
    message: 'Too many requests, please try again later.',
  })
);

// Health check route to check is my app up or not
app.get('/health', (_req: Request, res: Response) => {
  return res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.all(/.*/, (req: Request, _res: Response, next: NextFunction) => {
  next(
    new ApiError(
      StatusCodes.NOT_FOUND,
      `Cannot ${req.method} ${req.originalUrl}: Route not found`
    )
  );
});

app.use(errorMiddleware);

export default app;
