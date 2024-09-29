import { Request, Response, Router } from "express";
import { errorHandler } from "../error-handler";

const healthRoutes: Router = Router()

healthRoutes.get('/', [], errorHandler((req: Request, res: Response) => { res.json({ message: 'API is healthy' }); }));

export default healthRoutes;