import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express, Request, Response } from 'express';
import { version } from '../../package.json';
import { NODE_ENV } from '../secrets';
import basicAuthMiddleware from '../middlewares/basicAuth';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Coffee Dash API Docs',
      version,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        apiKeyAuth: {
          type: 'apiKey',
          name: 'x-api-key',
          in: 'header',
        },
      },
    },
    tags: [
      { name: 'Health Check', description: 'Health check services' },
      { name: 'Auth', description: 'User Authentication' },
    ],
    security: [
      {
        bearerAuth: [],
        apiKeyAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/schema/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: string) {
  if (NODE_ENV === 'production') {
    app.use(
      '/swagger',
      basicAuthMiddleware,
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec)
    );
  } else {
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  app.get('swagger.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.info(`Docs available at http://localhost:${port}/swagger`);
}

export default swaggerDocs;
