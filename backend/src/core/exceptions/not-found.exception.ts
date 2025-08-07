import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  readonly statusCode = 404;

  constructor(message: string = 'Not found', cause?: Error) {
    super(message, cause);
  }
}
