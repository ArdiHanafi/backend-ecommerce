import { ErrorCode, HttpException } from './root';

export class BadRequestException extends HttpException {
  constructor(message: string, errors: any, errorCode: ErrorCode) {
    super(errorCode, message, '400', errors);
  }
}
