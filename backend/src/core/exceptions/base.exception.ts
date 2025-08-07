export abstract class BaseException extends Error {
  abstract readonly statusCode: number;
  readonly message: string;

  protected constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message, { cause });
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
