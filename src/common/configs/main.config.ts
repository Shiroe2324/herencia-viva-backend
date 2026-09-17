import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';
import ms from 'ms';

import { ENV_VALIDATION_CONFIG } from '@/constants';
import { LanguageCodes, NodeEnv } from '@/enums';
import type { MainConfig as IMainConfig } from '@/types';

const mainSchema = Joi.object<IMainConfig>({
  NODE_ENV: Joi.string()
    .valid(...Object.values(NodeEnv))
    .default(NodeEnv.DEVELOPMENT),
  BACKEND_PORT: Joi.number().default(4000),
  APP_NAME: Joi.string().required(),
  ENABLE_SEEDS: Joi.boolean().default(false),
  DEFAULT_LANGUAGE: Joi.string()
    .valid(...Object.values(LanguageCodes))
    .default(LanguageCodes.EN),
  EMAIL_VERIFICATION_EXPIRATION: Joi.alternatives(Joi.number(), Joi.string()).default('1d'),
  RESET_PASSWORD_EXPIRATION: Joi.alternatives(Joi.number(), Joi.string()).default('1h'),
  RECOVERY_ACCOUNT_EXPIRATION: Joi.alternatives(Joi.number(), Joi.string()).default('1h'),
  EMAIL_VERIFICATION_URL: Joi.string().uri().required(),
  RESET_PASSWORD_URL: Joi.string().uri().required(),
  RECOVERY_ACCOUNT_URL: Joi.string().uri().required(),
});

const { value, error } = mainSchema.validate(process.env, ENV_VALIDATION_CONFIG);
if (error) throw new Error(`Main configuration validation error: ${error.message}`);

export const mainConfig = registerAs('main-config', () => ({
  isProduction: value.NODE_ENV === NodeEnv.PRODUCTION,
  isDevelopment: value.NODE_ENV === NodeEnv.DEVELOPMENT,
  isTest: value.NODE_ENV === NodeEnv.TEST,
  isProvision: value.NODE_ENV === NodeEnv.PROVISION,
  nodeEnv: value.NODE_ENV,
  backendPort: value.BACKEND_PORT,
  appName: value.APP_NAME,
  enableSeeds: value.ENABLE_SEEDS,
  defaultLanguage: value.DEFAULT_LANGUAGE,
  emailVerificationExpiration: ms(value.EMAIL_VERIFICATION_EXPIRATION),
  resetPasswordExpiration: ms(value.RESET_PASSWORD_EXPIRATION),
  recoveryAccountExpiration: ms(value.RECOVERY_ACCOUNT_EXPIRATION),
  emailVerificationUrl: value.EMAIL_VERIFICATION_URL,
  resetPasswordUrl: value.RESET_PASSWORD_URL,
  recoveryAccountUrl: value.RECOVERY_ACCOUNT_URL,
}));

export type MainConfig = ConfigType<typeof mainConfig>;

export const IS_DEVELOPMENT = value.NODE_ENV === NodeEnv.DEVELOPMENT;
