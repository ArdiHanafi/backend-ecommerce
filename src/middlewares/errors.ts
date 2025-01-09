/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException } from '../exceptions/root';
import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.statusCode || 500).json({
    message: error.message,
    errorCode: error.errorCode,
    error: error.errors,
  });
};