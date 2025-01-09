import { ErrorCode, HttpException } from './root';

export class NotFoundException extends HttpException {
  /**
   * @param errorCode - A specific error code identifying the type of error (type: `ErrorCode`).
   * @param message - A descriptive message for the error (type: `string`).
   */
  constructor(errorCode: ErrorCode, message: string) {
    super(errorCode, 404, message, 'Not Found');
  }
}
