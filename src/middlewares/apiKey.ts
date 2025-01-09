import { RequestHandler } from 'express';
import { UnauthorizeException } from '../exceptions/unauthorized';
import { ErrorCode } from '../exceptions/root';
import { API_KEY } from '../secrets';

const apiKeyMiddleware: RequestHandler = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return next(
      new UnauthorizeException(
        ErrorCode.UNAUTHORIZED,
        'Unauthorized: Missing API key',
        null
      )
    );
  }

  if (apiKey !== API_KEY) {
    return next(
      new UnauthorizeException(
        ErrorCode.UNAUTHORIZED,
        'Unauthorized: Invalid API key',
        null
      )
    );
  }

  next();
};

export default apiKeyMiddleware;
