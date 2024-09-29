import { NextFunction, Request, Response } from "express";
import { UnauthorizeException } from "../exceptions/unauthorized";
import * as jwt from "jsonwebtoken";
import { ErrorCode } from "../exceptions/root";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizeException("Unauthorize", ErrorCode.UNAUTHORIZED));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      next(new UnauthorizeException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizeException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleware;
