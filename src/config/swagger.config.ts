import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../package.json');

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
  apis: ['src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true })
  );
};
