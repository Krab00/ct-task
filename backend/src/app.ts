import express from 'express';
import { setupApp } from './config';

const app = express();

export const initializeApp = async () => {
  await setupApp(app);
  return app;
};
