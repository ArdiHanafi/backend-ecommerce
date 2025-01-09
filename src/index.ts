import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import { PORT } from './secrets';
import rootRouter from './routes';
import { errorMiddleware } from './middlewares/errors';
import swaggerDocs from './utils/swagger';

const app: Express = express();

app.use(express.json());

swaggerDocs(app, PORT as string);
app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
  log: ['query'],
})

app.use(errorMiddleware as any);

app.listen(PORT, () => console.log(`App running on PORT: ${PORT}`));
