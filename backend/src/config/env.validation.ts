import Joi from 'joi';
import { DEFAULT_PORT, EnvType } from '@constants';

export const EnvValidation = Joi.object().keys({
  PORT: Joi.number().port().default(DEFAULT_PORT),
  NODE_ENV: Joi.string().valid(...Object.values(EnvType)),
});
