import express, { Express } from 'express';
import path from 'path';
import logger from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { autoRegisterRoutes, errorHandler } from '@core/middlewares';
import { initializeDatabase } from '@database/data-source';

const setupCors = (app: Express) => {
  const corsOptions = {
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: false,
  };
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
};

export const setupApp = async (app: Express) => {
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../public')));
  setupCors(app);
  await initializeDatabase();
  const registerRoutes = autoRegisterRoutes();
  await registerRoutes(app);
  errorHandler(app);
};
