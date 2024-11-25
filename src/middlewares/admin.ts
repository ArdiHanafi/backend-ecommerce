import { NextFunction, Request, Response } from 'express';
import { UnauthorizeException } from '../exceptions/unauthorized';
import { ErrorCode } from '../exceptions/root';

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  if (user.role === 'ADMIN') {
    next();
  } else {
    next(new UnauthorizeException('Unauthorized', ErrorCode.UNAUTHORIZED));
  }
};

export default adminMiddleware;
