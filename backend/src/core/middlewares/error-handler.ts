import {
  Express,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { BaseException } from '@core/exceptions/base.exception';

export const asyncRouteHandler = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (app: Express) => {
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
  });

  app.use((error: BaseException, req: Request, res: Response) => {
    console.log('Error caught by global handler:', error);

    if (error?.statusCode) {
      return res.status(error.statusCode).json({
        error: error.message,
        cause: error.cause,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      });
    }

    console.error('Unhandled error by global handler:', error);
    res.status(500).json({
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && {
        message: error.message,
        stack: error.stack,
      }),
    });
  });
};
