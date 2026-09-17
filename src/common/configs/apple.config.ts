import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ENV_VALIDATION_CONFIG } from '@/constants';
import type { AppleConfig as IAppleConfig } from '@/types';

const appleSchema = Joi.object<IAppleConfig>({
  APPLE_CLIENT_ID: Joi.string().required(),
  APPLE_TEAM_ID: Joi.string().required(),
  APPLE_KEY_ID: Joi.string().required(),
  APPLE_PRIVATE_KEY: Joi.string().required(),
  APPLE_CALLBACK_URL: Joi.string().uri().required(),
  APPLE_REDIRECT_URL: Joi.string().uri().required(),
});

const { value, error } = appleSchema.validate(process.env, ENV_VALIDATION_CONFIG);
if (error) throw new Error(`Apple configuration validation error: ${error.message}`);

export const appleConfig = registerAs('apple-config', () => ({
  clientId: value.APPLE_CLIENT_ID,
  teamId: value.APPLE_TEAM_ID,
  keyId: value.APPLE_KEY_ID,
  privateKey: value.APPLE_PRIVATE_KEY,
  callbackUrl: value.APPLE_CALLBACK_URL,
  redirectUrl: value.APPLE_REDIRECT_URL,
}));

export type AppleConfig = ConfigType<typeof appleConfig>;
