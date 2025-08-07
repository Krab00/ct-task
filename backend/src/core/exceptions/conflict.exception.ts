import { BaseException } from './base.exception';

export class ConflictException extends BaseException {
  readonly statusCode = 409;

  constructor(message: string = 'Resource conflict', cause?: Error) {
    super(message, cause);
  }
}
