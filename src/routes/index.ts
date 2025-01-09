import { Router } from 'express';
import healthRoutes from './healthCheck';
import authRoutes from './auth';

const rootRouter: Router = Router();

rootRouter.use('/health', healthRoutes);
rootRouter.use('/auth', authRoutes);

export default rootRouter;
