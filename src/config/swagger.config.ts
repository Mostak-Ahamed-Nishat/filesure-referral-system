import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';
import fs from 'fs';

//  Load package.json safely (avoids import assertion issues)
const pkgPath = path.resolve(__dirname, '../../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: `${pkg.name} API Docs`,
      version: pkg.version,
      description: 'FileSure Referral System API Documentation',
    },
    servers: [
      { url: 'http://localhost:5000/api/v1', description: 'Development' },
      {
        url: 'https://filesure-api.onrender.com/api/v1',
        description: 'Production',
      },
    ],
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

  //  Use absolute path for safety on Vercel build
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
  console.log('Swagger UI available at → /api-docs');
};
