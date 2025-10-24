import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });

interface Config {
  PORT: number;
  DATABASE_URL: string;
  NODE_ENV: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRE: string;
  JWT_REFRESH_EXPIRE: string;
  CORS_ORIGIN: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
}

function getEnvVar(name: string, required = true): string {
  const value = process.env[name];
  if (required && (!value || value.trim() === '')) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value as string;
}

function validateJWTSecret(secret: string, name: string): void {
  if (secret.length < 32) {
    throw new Error(`${name} must be at least 32 characters long`);
  }
}

const jwtAccessSecret = getEnvVar('JWT_ACCESS_SECRET');
const jwtRefreshSecret = getEnvVar('JWT_REFRESH_SECRET');

validateJWTSecret(jwtAccessSecret, 'JWT_ACCESS_SECRET');
validateJWTSecret(jwtRefreshSecret, 'JWT_REFRESH_SECRET');

const config: Config = {
  PORT: Number(getEnvVar('PORT')),
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  NODE_ENV: getEnvVar('NODE_ENV', false) || 'development',
  JWT_ACCESS_SECRET: jwtAccessSecret,
  JWT_REFRESH_SECRET: jwtRefreshSecret,
  JWT_ACCESS_EXPIRE: getEnvVar('JWT_ACCESS_EXPIRE', false) || '24h',
  JWT_REFRESH_EXPIRE: getEnvVar('JWT_REFRESH_EXPIRE', false) || '7d',
  CORS_ORIGIN: getEnvVar('CORS_ORIGIN', false) || 'http://localhost:3000',
  RATE_LIMIT_WINDOW_MS:
    Number(getEnvVar('RATE_LIMIT_WINDOW_MS', false)) || 900000,
  RATE_LIMIT_MAX_REQUESTS:
    Number(getEnvVar('RATE_LIMIT_MAX_REQUESTS', false)) || 100,
};

export default config;
