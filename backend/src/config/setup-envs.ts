import { Env } from '@core/models';
import dotenv from 'dotenv';
import path from 'path';
import { EnvValidation } from './env.validation';
import { EnvType } from '@constants';

export const setupEnvs = (): Env => {
  const env = process.env.NODE_ENV || EnvType.Develop;

  const envFile = path.resolve(process.cwd(), `.env.${env}`);
  dotenv.config({ path: envFile });
  const { error, value: validatedEnv } = EnvValidation.validate(process.env, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    console.error('Invalid environment variables:', error);
    process.exit(1);
  }

  return {
    port: validatedEnv.PORT,
    env: validatedEnv.NODE_ENV,
  };
};
