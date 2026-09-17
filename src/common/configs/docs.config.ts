import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ENV_VALIDATION_CONFIG } from '@/constants';
import type { DocsConfig as IDocsConfig } from '@/types';

const docsSchema = Joi.object<IDocsConfig>({
  DOCS_USER: Joi.string().default('admin'),
  DOCS_PASSWORD: Joi.string().default('password1234'),
  DOCS_NAME: Joi.string().default('API Documentation'),
  DOCS_ICON: Joi.string().uri().default('https://nestjs.com/img/logo_text.svg'),
  DOCS_FAVICON: Joi.string().uri().default('https://nestjs.com/img/favicon.ico'),
  DOCS_TITLE: Joi.string().default('My API'),
  DOCS_DESCRIPTION: Joi.string().default('API documentation'),
  DOCS_VERSION: Joi.string().default('1.0.0'),
  DOCS_ENABLED: Joi.boolean().default(true),
});

const { value, error } = docsSchema.validate(process.env, ENV_VALIDATION_CONFIG);
if (error) throw new Error(`Docs configuration validation error: ${error.message}`);

export const docsConfig = registerAs('docs-config', () => ({
  user: value.DOCS_USER,
  password: value.DOCS_PASSWORD,
  name: value.DOCS_NAME,
  icon: value.DOCS_ICON,
  favicon: value.DOCS_FAVICON,
  title: value.DOCS_TITLE,
  description: value.DOCS_DESCRIPTION,
  version: value.DOCS_VERSION,
  enabled: value.DOCS_ENABLED,
}));

export type DocsConfig = ConfigType<typeof docsConfig>;
