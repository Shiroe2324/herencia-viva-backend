import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ENV_VALIDATION_CONFIG } from '@/constants';
import type { JwtConfig as IJwtConfig } from '@/types';

const jwtSchema = Joi.object<IJwtConfig>({
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRATION: Joi.string().default('1h'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
});

const { value, error } = jwtSchema.validate(process.env, ENV_VALIDATION_CONFIG);
if (error) throw new Error(`JWT configuration validation error: ${error.message}`);

export const jwtConfig = registerAs('jwt-config', () => ({
  accessSecret: value.JWT_ACCESS_SECRET,
  accessExpiration: value.JWT_ACCESS_EXPIRATION,
  refreshSecret: value.JWT_REFRESH_SECRET,
  refreshExpiration: value.JWT_REFRESH_EXPIRATION,
}));

export type JwtConfig = ConfigType<typeof jwtConfig>;
