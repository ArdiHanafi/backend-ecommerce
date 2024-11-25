import { HttpException } from './root';

export class UnprocessableEntity extends HttpException {
  constructor(error: any, message: string, errorCode: number) {
    super(errorCode, message, '422', error);
  }
}
