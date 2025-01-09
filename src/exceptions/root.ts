export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  ADDRESS_NOT_FOUND = 1004,
  ADDRESS_DOES_NOT_BELONG = 1005,
  UNPROCESSABLE_ENTITY = 2001,
  INTERNAL_EXEPTION = 3001,
  UNAUTHORIZED = 4001,

  PRODUCT_NOT_FOUND = 5001,

  ORDER_NOT_FOUND = 6001,
}

export class HttpException extends Error {
  errorCode: ErrorCode;
  statusCode: number;
  message: string;
  errors: any;

   /**
   * @param errorCode - A specific error code identifying the type of error (type: `ErrorCode`).
   * @param statusCode - The HTTP status code associated with the error (type: `number`).
   * @param message - A descriptive message for the error (type: `string`).
   * @param error - Additional error details or payload (type: `any`).
   */
  constructor(
    errorCode: ErrorCode,
    statusCode: number,
    message: string,
    error: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = error;
  }
}

