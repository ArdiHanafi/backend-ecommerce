import { HttpException } from './root';

export class InternalExeption extends HttpException {
  constructor(message: string, errors: any, errorCode: number) {
    super(errorCode, message, '500', errors);
  }
}
