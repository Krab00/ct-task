import { DataSource } from 'typeorm';
import { Env } from '@core/models';
import { EnvType } from '@constants';

export const createDatabaseConfig = (env: Env): DataSource => {
  const isProduction = env.env === EnvType.Production;

  return new DataSource({
    type: 'mysql',
    host: env.db.host || 'localhost',
    port: env.db.port,
    username: env.db.user,
    password: env.db.password,
    database: env.db.database,
    synchronize: !!env.db.sync,
    entities: isProduction
      ? ['dist/database/entities/**/*.entity.js']
      : ['src/database/entities/**/*.entity.ts'],
    migrations: isProduction
      ? ['dist/database/migrations/**/*.js']
      : ['src/database/migrations/**/*.ts'],
    subscribers: isProduction
      ? ['dist/database/subscribers/**/*.js']
      : ['src/database/subscribers/**/*.ts'],
  });
};
