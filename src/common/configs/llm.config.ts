import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ENV_VALIDATION_CONFIG } from '@/constants';
import type { LLMConfig as ILLMConfig } from '@/types';

const llmSchema = Joi.object<ILLMConfig>({
  LLM_PROVIDER: Joi.string().valid('google', 'openai', 'anthropic', 'deepseek', 'groq', 'ollama').required(),
  LLM_API_KEY: Joi.string().required(),
  LLM_MODEL: Joi.string().required(),
  LLM_EMBEDDING_MODEL: Joi.string().required(),
  LLM_OLLAMA_BASE_URL: Joi.string().uri().optional(),
  LLM_SYSTEM_PROMPT: Joi.string().required(),
  LLM_TITLE_PROMPT: Joi.string().required(),
  LLM_CONTEXT_FORMAT: Joi.string().required(),
  LLM_FALLBACK_MESSAGE: Joi.string().required(),
  LLM_EMPTY_CONTEXT_MESSAGE: Joi.string().required(),
  LLM_RECENT_MESSAGES_LIMIT: Joi.number().integer().min(1).default(20),
  LLM_RELEVANCE_THRESHOLD: Joi.number().min(0).max(1).default(0.8),
  LLM_MAX_OUTPUT_TOKENS: Joi.number().positive().default(1000),
});

const { value, error } = llmSchema.validate(process.env, ENV_VALIDATION_CONFIG);
if (error) throw new Error(`LLM configuration validation error: ${error.message}`);

export const llmConfig = registerAs('llm-config', () => ({
  provider: value.LLM_PROVIDER,
  apiKey: value.LLM_API_KEY,
  model: value.LLM_MODEL,
  embeddingModel: value.LLM_EMBEDDING_MODEL,
  ollamaBaseUrl: value.LLM_OLLAMA_BASE_URL,
  systemPrompt: value.LLM_SYSTEM_PROMPT,
  titlePrompt: value.LLM_TITLE_PROMPT,
  contextFormat: value.LLM_CONTEXT_FORMAT,
  fallbackMessage: value.LLM_FALLBACK_MESSAGE,
  emptyContextMessage: value.LLM_EMPTY_CONTEXT_MESSAGE,
  recentMessagesLimit: value.LLM_RECENT_MESSAGES_LIMIT,
  relevanceThreshold: value.LLM_RELEVANCE_THRESHOLD,
  maxOutputTokens: value.LLM_MAX_OUTPUT_TOKENS,
}));

export type LLMConfig = ConfigType<typeof llmConfig>;
