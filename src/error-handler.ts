import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ErrorCode, HttpException } from './exceptions/root';
import { InternalExeption } from './exceptions/internal-exeption';
import { BadRequestException } from './exceptions/bad-request';

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else if (error instanceof ZodError) {
        exception = new BadRequestException(
          'Unprocessable entity.',
          error,
          ErrorCode.UNPROCESSABLE_ENTITY
        );
      } else {
        exception = new InternalExeption(
          'Somthing went wrong!',
          error,
          ErrorCode.INTERNAL_EXEPTION
        );
      }
      next(exception);
    }
  };
};
