import 'reflect-metadata';
import { createDatabaseConfig } from '@config/database.config';
import { APP_CONFIG } from '@config/config';

export const AppDataSource = createDatabaseConfig(APP_CONFIG);

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Error during database initialization:', error);
    process.exit(1);
  }
};
