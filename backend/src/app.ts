import express from 'express';
import { configApp } from './config';

const app = express();

export const initializeApp = async () => {
  await configApp(app);
  return app;
};
