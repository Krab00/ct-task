import express, { Express } from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import * as console from 'node:console';
import { autoRegisterRoutes } from '../core';
import { initializeDatabase } from '@database/data-source';

export const setupApp = async (app: Express) => {
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../public')));
  await initializeDatabase();
  console.log('Start route register');
  const register = autoRegisterRoutes();
  await register(app);
  console.log('End route register');
};
