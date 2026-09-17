import type { ValidationOptions } from 'joi';

export const TOKENS = {
  CHROMA: Symbol('CHROMA'),
  LLM_PROVIDER: Symbol('LLM_PROVIDER'),
  LLM_EMBEDDING_PROVIDER: Symbol('LLM_EMBEDDING_PROVIDER'),
  MINIO: Symbol('MINIO'),
  REDIS: Symbol('REDIS'),
  RESEND: Symbol('RESEND'),
} as const;

export const QUEUES = {
  SEND_MAIL: 'SEND_MAIL',
  UPDATE_IMAGE: 'UPDATE_IMAGE',
  DELETE_IMAGE: 'DELETE_IMAGE',
} as const;

export const ENV_VALIDATION_CONFIG: ValidationOptions = {
  allowUnknown: true,
  abortEarly: false,
  stripUnknown: true,
} as const;

export const ALPHANUMERIC_PATTERN = new RegExp('^[a-z0-9]+$');
