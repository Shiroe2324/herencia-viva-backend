import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ENV_VALIDATION_CONFIG } from '@/constants';
import type { RedisConfig as IRedisConfig } from '@/types';

const redisSchema = Joi.object<IRedisConfig>({
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
  REDIS_USERNAME: Joi.string().allow('').optional(),
});

const { value, error } = redisSchema.validate(process.env, ENV_VALIDATION_CONFIG);
if (error) throw new Error(`Redis configuration validation error: ${error.message}`);

export const redisConfig = registerAs('redis-config', () => ({
  host: value.REDIS_HOST,
  port: value.REDIS_PORT,
  password: value.REDIS_PASSWORD,
  username: value.REDIS_USERNAME,
}));

export type RedisConfig = ConfigType<typeof redisConfig>;
