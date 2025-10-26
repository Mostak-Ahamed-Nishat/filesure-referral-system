import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';
import fs from 'fs';

let pkg: { name: string; version: string };

try {
  // Try to resolve package.json safely
  const possiblePaths = [
    path.resolve(process.cwd(), 'package.json'),
    path.resolve(__dirname, '../../package.json'),
  ];

  const pkgFile = possiblePaths.find((p) => fs.existsSync(p));
  pkg = JSON.parse(fs.readFileSync(pkgFile!, 'utf-8'));
} catch {
  pkg = { name: 'Unknown App', version: '0.0.0' };
  console.warn(' Could not load package.json metadata.');
}

// Fix: Use dynamic server URL instead of hardcoded render.com
const getServerUrl = (): string => {
  // Use API_URL if explicitly set
  if (process.env.API_URL) {
    return process.env.API_URL;
  }

  // Vercel deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/v1`;
  }

  // Local development
  return 'http://localhost:5000/api/v1';
};

const serverUrl = getServerUrl();

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: `${pkg.name} API Docs`,
      version: pkg.version,
      description: 'FileSure Referral System API Documentation',
    },
    servers: [{ url: serverUrl }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [path.resolve(__dirname, '../modules/**/*.routes.ts')],
};

export const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
    })
  );
  console.log(' Swagger UI available at → /api-docs');
};
