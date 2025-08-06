import { DataSource } from 'typeorm';
import { Env } from '@core/models';

export const createDatabaseConfig = (env: Env): DataSource => {
  return new DataSource({
    type: 'mysql',
    host: env.db.host || 'localhost',
    port: env.db.port,
    username: env.db.user,
    password: env.db.password,
    database: env.db.database,
    synchronize: !!env.db.sync,
    entities: ['src/database/entities/**/*.entity.ts'],
    migrations: ['src/database/migrations/**/*.ts'],
    subscribers: ['src/database/subscribers/**/*.ts'],
  });
};