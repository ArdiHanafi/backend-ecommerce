import { RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import { UnauthorizeException } from '../exceptions/unauthorized';
import { ErrorCode } from '../exceptions/root';
import { JWT_SECRET } from '../secrets';
import { prismaClient } from '..';

const authMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new UnauthorizeException(ErrorCode.UNAUTHORIZED, 'Unauthorized: Missing or invalid token', null)
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });

    if (!user) {
      return next(
        new UnauthorizeException(ErrorCode.UNAUTHORIZED, 'Unauthorized: User not found', null)
      );
    }

    req.user = user;

    next();
  } catch (error) {
    return next(
      new UnauthorizeException(ErrorCode.UNAUTHORIZED, 'Unauthorized: Invalid or expired token', null)
    );
  }
};

export default authMiddleware;
