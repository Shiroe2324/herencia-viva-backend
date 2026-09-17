import type { CipherGCMTypes } from 'crypto';
import type { StringValue } from 'ms';

import type { LanguageCodes, NodeEnv } from '@/enums';

export interface ChromaConfig {
  CHROMA_HOST: string;
  CHROMA_PORT: number;
  CHROMA_COLLECTION_NAME: string;
  CHROMA_RESET_ON_START: boolean;
  CHROMA_TIMEOUT_MS: number;
  CHROMA_BATCH_SIZE: number;
  CHROMA_API_KEY?: string;
  CHROMA_TENANT?: string;
  CHROMA_DATABASE?: string;
}

export interface AppleConfig {
  APPLE_CLIENT_ID: string;
  APPLE_TEAM_ID: string;
  APPLE_KEY_ID: string;
  APPLE_PRIVATE_KEY: string;
  APPLE_CALLBACK_URL: string;
  APPLE_REDIRECT_URL: string;
}

export interface DatabaseConfig {
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_NAME: string;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_REJECT_UNAUTHORIZED: boolean;
  DATABASE_SSL_CA?: string;
}

export interface DocsConfig {
  DOCS_USER: string;
  DOCS_PASSWORD: string;
  DOCS_NAME: string;
  DOCS_ICON: string;
  DOCS_FAVICON: string;
  DOCS_TITLE: string;
  DOCS_DESCRIPTION: string;
  DOCS_VERSION: string;
  DOCS_ENABLED: boolean;
}

export interface EmailConfig {
  EMAIL_FROM: string;
  EMAIL_FROM_NAME: string;
  EMAIL_CONCURRENCY_LIMIT: number;
  EMAIL_API_KEY: string;
}

export interface EncryptionConfig {
  ENCRYPTION_ALGORITHM: CipherGCMTypes;
  ENCRYPTION_IV_LENGTH: number;
  ENCRYPTION_KEY: string;
}

export interface GoogleConfig {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  GOOGLE_REDIRECT_URL: string;
}

export interface LLMConfig {
  LLM_PROVIDER: 'google' | 'openai' | 'anthropic' | 'deepseek' | 'groq' | 'ollama';
  LLM_API_KEY: string;
  LLM_MODEL: string;
  LLM_EMBEDDING_MODEL: string;
  LLM_OLLAMA_BASE_URL?: string;
  LLM_SYSTEM_PROMPT: string;
  LLM_TITLE_PROMPT: string;
  LLM_CONTEXT_FORMAT: string;
  LLM_FALLBACK_MESSAGE: string;
  LLM_EMPTY_CONTEXT_MESSAGE: string;
  LLM_RECENT_MESSAGES_LIMIT: number;
  LLM_RELEVANCE_THRESHOLD: number;
  LLM_MAX_OUTPUT_TOKENS: number;
}

export interface JwtConfig {
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRATION: StringValue;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRATION: StringValue;
}

export interface LimitsConfig {
  MAX_DISK_USAGE_PERCENT: number;
  MAX_MEMORY_HEAP_SIZE: number;
  MAX_MEMORY_RSS_SIZE: number;
  MAX_GET_ALL_SESSION_LOGS_LIMIT: number;
  MAX_GET_ALL_CHATS_LIMIT: number;
  MAX_GET_ALL_CONTEXTS_LIMIT: number;
  MAX_GET_ALL_USERS_LIMIT: number;
  MAX_IMAGE_FILE_SIZE: number;
  MIN_CHAT_TITLE_LENGTH: number;
  MIN_CONTEXT_QUESTION_LENGTH: number;
  MIN_CONTEXT_ANSWER_LENGTH: number;
  MIN_CONTEXT_TAG_LENGTH: number;
  MIN_USER_CLIENT_AGE: number;
  MIN_USER_DISPLAY_NAME_LENGTH: number;
  MIN_USER_PASSWORD_LENGTH: number;
  MIN_USER_PROMPT_CONTEXT_LIMIT: number;
  MIN_USER_PROMPT_LENGTH: number;
  MIN_USER_USERNAME_LENGTH: number;
  MAX_CHAT_TITLE_LENGTH: number;
  MAX_CONTEXT_QUESTION_LENGTH: number;
  MAX_CONTEXT_ANSWER_LENGTH: number;
  MAX_CONTEXT_TAG_LENGTH: number;
  MAX_USER_CLIENT_AGE: number;
  MAX_USER_DISPLAY_NAME_LENGTH: number;
  MAX_USER_PASSWORD_LENGTH: number;
  MAX_USER_PROMPT_CONTEXT_LIMIT: number;
  MAX_USER_PROMPT_LENGTH: number;
  MAX_USER_USERNAME_LENGTH: number;
}

export interface MainConfig {
  NODE_ENV: NodeEnv;
  BACKEND_PORT: number;
  APP_NAME: string;
  ENABLE_SEEDS: boolean;
  DEFAULT_LANGUAGE: LanguageCodes;
  EMAIL_VERIFICATION_EXPIRATION: StringValue;
  RESET_PASSWORD_EXPIRATION: StringValue;
  RECOVERY_ACCOUNT_EXPIRATION: StringValue;
  EMAIL_VERIFICATION_URL: string;
  RESET_PASSWORD_URL: string;
  RECOVERY_ACCOUNT_URL: string;
}

export interface MinioConfig {
  MINIO_ENDPOINT: string;
  MINIO_BUCKET: string;
  MINIO_PUBLIC_URL: string;
  MINIO_ROOT_USER: string;
  MINIO_ROOT_PASSWORD: string;
  MINIO_REGION: string;
}

export interface RedisConfig {
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD?: string;
  REDIS_USERNAME?: string;
}
