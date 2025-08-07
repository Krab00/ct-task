import { BaseException } from './base.exception';

export class ValidationException extends BaseException {
  readonly statusCode = 400;

  constructor(message: string = 'Validation failed', cause?: Error) {
    super(message, cause);
  }
}
