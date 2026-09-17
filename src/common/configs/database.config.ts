import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ENV_VALIDATION_CONFIG } from '@/constants';
import type { DatabaseConfig as IDatabaseConfig } from '@/types';

const databaseSchema = Joi.object<IDatabaseConfig>({
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_REJECT_UNAUTHORIZED: Joi.boolean().default(false),
  DATABASE_SSL_CA: Joi.string().optional(),
});

const { value, error } = databaseSchema.validate(process.env, ENV_VALIDATION_CONFIG);
if (error) throw new Error(`Database configuration validation error: ${error.message}`);

export const databaseConfig = registerAs('database-config', () => ({
  host: value.DATABASE_HOST,
  port: value.DATABASE_PORT,
  name: value.DATABASE_NAME,
  username: value.DATABASE_USERNAME,
  password: value.DATABASE_PASSWORD,
  rejectUnauthorized: value.DATABASE_REJECT_UNAUTHORIZED,
  sslCa: value.DATABASE_SSL_CA?.replace(/\\n/g, '\n'),
}));

export type DatabaseConfig = ConfigType<typeof databaseConfig>;

export const DATABASE_HOST = value.DATABASE_HOST;
export const DATABASE_PORT = value.DATABASE_PORT;
export const DATABASE_NAME = value.DATABASE_NAME;
export const DATABASE_USERNAME = value.DATABASE_USERNAME;
export const DATABASE_PASSWORD = value.DATABASE_PASSWORD;
export const DATABASE_REJECT_UNAUTHORIZED = value.DATABASE_REJECT_UNAUTHORIZED;
export const DATABASE_SSL_CA = value.DATABASE_SSL_CA?.replace(/\\n/g, '\n');
