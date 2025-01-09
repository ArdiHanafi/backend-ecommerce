import { ErrorCode, HttpException } from './root';

export class BadRequestException extends HttpException {
  /**
   * @param errorCode - A specific error code identifying the type of error (type: `ErrorCode`).
   * @param message - A descriptive message for the error (type: `string`).
   * @param error - Additional error details or payload (type: `any`).
   */
  constructor(errorCode: ErrorCode, message: string, error: any) {
    super(errorCode, 400, message, error);
  }
}
