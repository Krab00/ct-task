import { initializeApp } from './app';
import { DEFAULT_PORT } from '@constants';
import * as process from 'node:process';

const port = parseInt(process.env.PORT || DEFAULT_PORT.toString(), 10);

const startServer = async () => {
  try {
    const app = await initializeApp();

    app.listen(port,  () => {
      console.log(`Server running in ${process.env.NODE_EV} on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
