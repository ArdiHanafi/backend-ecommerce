import { Request, Response, Router } from 'express';
import { errorHandler } from '../error-handler';

const healthRoutes: Router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags:
 *       - Health Check
 *     description: Response if the app is up and running
 *     responses:
 *       200:
 *         description: API is healthy
 */
healthRoutes.get(
  '/',
  [],
  errorHandler((req: Request, res: Response) => {
    res.json({ message: 'API is healthy' });
  })
);

export default healthRoutes;
