import Joi from 'joi';
import { DEFAULT_DB_PORT, DEFAULT_PORT, EnvType } from '@constants';

export const EnvValidation = Joi.object().keys({
  PORT: Joi.number().port().default(DEFAULT_PORT),
  NODE_ENV: Joi.string().valid(...Object.values(EnvType)),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_PORT: Joi.number().port().default(DEFAULT_DB_PORT),
  DB_HOST: Joi.string().default('localhost'),
  DB_SYNC: Joi.boolean().default(false),
});
