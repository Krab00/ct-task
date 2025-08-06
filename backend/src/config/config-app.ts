import express, { Express } from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { setupEnvs } from './setup-envs';
import * as console from 'node:console';
import { autoRegisterRoutes } from '../core';

export const configApp = async (app: Express) => {
  const config = setupEnvs();
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../public')));
  app.locals.config = config;
  console.log('Start route register');
  const register = autoRegisterRoutes();
  await register(app);
  console.log('End route register');
};
