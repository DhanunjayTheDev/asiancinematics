import config from '../config';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Asian Cinematics API',
      version: '1.0.0',
      description: 'Enterprise Business Operating System API',
      contact: { name: 'Asian Cinematics', email: 'support@asiancinematics.com' },
    },
    servers: [
      { url: `http://localhost:${config.port}/api/v1`, description: 'Development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};
