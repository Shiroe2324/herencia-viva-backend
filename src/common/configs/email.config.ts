import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ENV_VALIDATION_CONFIG } from '@/constants';
import type { EmailConfig as IEmailConfig } from '@/types';

const emailSchema = Joi.object<IEmailConfig>({
  EMAIL_FROM: Joi.string().email().required(),
  EMAIL_FROM_NAME: Joi.string().required(),
  EMAIL_CONCURRENCY_LIMIT: Joi.number().integer().min(1).default(5),
  EMAIL_API_KEY: Joi.string().required(),
});

const { value, error } = emailSchema.validate(process.env, ENV_VALIDATION_CONFIG);
if (error) throw new Error(`Email configuration validation error: ${error.message}`);

export const emailConfig = registerAs('email-config', () => ({
  from: value.EMAIL_FROM,
  fromName: value.EMAIL_FROM_NAME,
  concurrencyLimit: value.EMAIL_CONCURRENCY_LIMIT,
  apiKey: value.EMAIL_API_KEY,
}));

export type EmailConfig = ConfigType<typeof emailConfig>;
