import { NextFunction, Request, Response } from 'express';
import { BASIC_AUTH_USER, BASIC_AUTH_PASSWORD } from '../secrets';

const basicAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check for the Authorization header
  const authHeader = req.headers.authorization || '';
  const base64Credentials = authHeader.split(' ')[1] || '';
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'ascii'
  );
  const [username, password] = credentials.split(':');

  // Check username and password
  const isAuthenticated =
    username === BASIC_AUTH_USER && password === BASIC_AUTH_PASSWORD;

  if (isAuthenticated) {
    return next();
  }
  res.setHeader('WWW-Authenticate', 'Basic realm="Swagger API Docs"');
  res.status(401).send('Unauthorized');
};

export default basicAuthMiddleware;
