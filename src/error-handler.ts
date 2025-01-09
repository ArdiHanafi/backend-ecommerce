import { ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';
import { ErrorCode, HttpException } from './exceptions/root';
import { BadRequestException } from './exceptions/bad-request';
import { InternalExeption } from './exceptions/internal-exeption';

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else if (error instanceof ZodError) {
        exception = new BadRequestException(ErrorCode.UNPROCESSABLE_ENTITY, 'Unprocessable entity.', error);
      } else {
        exception = new InternalExeption(ErrorCode.INTERNAL_EXEPTION, 'Somthing went wrong!', error);
      }
      next(exception);
    }
  };
};
