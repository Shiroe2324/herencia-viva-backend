import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ENV_VALIDATION_CONFIG } from '@/constants';
import type { GoogleConfig as IGoogleConfig } from '@/types';

const googleSchema = Joi.object<IGoogleConfig>({
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().uri().required(),
  GOOGLE_REDIRECT_URL: Joi.string().uri().required(),
});

const { value, error } = googleSchema.validate(process.env, ENV_VALIDATION_CONFIG);
if (error) throw new Error(`Google configuration validation error: ${error.message}`);

export const googleConfig = registerAs('google-config', () => ({
  clientId: value.GOOGLE_CLIENT_ID,
  clientSecret: value.GOOGLE_CLIENT_SECRET,
  callbackUrl: value.GOOGLE_CALLBACK_URL,
  redirectUrl: value.GOOGLE_REDIRECT_URL,
}));

export type GoogleConfig = ConfigType<typeof googleConfig>;
