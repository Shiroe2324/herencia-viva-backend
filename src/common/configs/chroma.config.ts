import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ENV_VALIDATION_CONFIG } from '@/constants';
import type { ChromaConfig as IChromaConfig } from '@/types';

const chromaSchema = Joi.object<IChromaConfig>({
  CHROMA_HOST: Joi.string().default('localhost'),
  CHROMA_PORT: Joi.number().integer().positive().default(8000),
  CHROMA_COLLECTION_NAME: Joi.string().required(),
  CHROMA_RESET_ON_START: Joi.boolean().default(false),
  CHROMA_TIMEOUT_MS: Joi.number().integer().positive().default(30000),
  CHROMA_BATCH_SIZE: Joi.number().integer().positive().default(25),
  CHROMA_API_KEY: Joi.string().optional(),
  CHROMA_TENANT: Joi.string().optional(),
  CHROMA_DATABASE: Joi.string().optional(),
}).and('CHROMA_API_KEY', 'CHROMA_TENANT', 'CHROMA_DATABASE');

const { value, error } = chromaSchema.validate(process.env, ENV_VALIDATION_CONFIG);
if (error) throw new Error(`Chroma configuration validation error: ${error.message}`);

export const chromaConfig = registerAs('chroma-config', () => ({
  host: value.CHROMA_HOST,
  port: value.CHROMA_PORT,
  collectionName: value.CHROMA_COLLECTION_NAME,
  resetOnStart: value.CHROMA_RESET_ON_START,
  timeoutMs: value.CHROMA_TIMEOUT_MS,
  batchSize: value.CHROMA_BATCH_SIZE,
  url: `http://${value.CHROMA_HOST}:${value.CHROMA_PORT}`,
  isCloud: Boolean(value.CHROMA_API_KEY),
  apiKey: value.CHROMA_API_KEY,
  tenant: value.CHROMA_TENANT,
  database: value.CHROMA_DATABASE,
}));

export type ChromaConfig = ConfigType<typeof chromaConfig>;
