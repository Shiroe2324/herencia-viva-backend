import { createAnthropic } from '@ai-sdk/anthropic';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import type { Provider } from '@nestjs/common';
import type { EmbeddingModel, LanguageModel } from 'ai';
import { createOllama } from 'ollama-ai-provider-v2';

import type { LLMConfig } from '@/configs';
import { llmConfig } from '@/configs';
import { TOKENS } from '@/constants';

function resolveModel(config: LLMConfig): LanguageModel {
  switch (config.provider) {
    case 'google':
      return createGoogleGenerativeAI({ apiKey: config.apiKey })(config.model);
    case 'openai':
      return createOpenAI({ apiKey: config.apiKey })(config.model);
    case 'anthropic':
      return createAnthropic({ apiKey: config.apiKey })(config.model);
    case 'deepseek':
      return createDeepSeek({ apiKey: config.apiKey })(config.model);
    case 'groq':
      return createGroq({ apiKey: config.apiKey })(config.model);
    case 'ollama':
      return createOllama({ baseURL: config.ollamaBaseUrl })(config.model);
    default:
      throw new Error(`Unsupported LLM provider: ${config.provider}`);
  }
}

function resolveEmbeddingModel(config: LLMConfig): EmbeddingModel {
  switch (config.provider) {
    case 'google':
      return createGoogleGenerativeAI({ apiKey: config.apiKey }).embeddingModel(config.embeddingModel);
    case 'openai':
      return createOpenAI({ apiKey: config.apiKey }).embeddingModel(config.embeddingModel);
    case 'anthropic':
      return createAnthropic({ apiKey: config.apiKey }).embeddingModel(config.embeddingModel);
    case 'deepseek':
      return createDeepSeek({ apiKey: config.apiKey }).embeddingModel(config.embeddingModel);
    case 'groq':
      return createGroq({ apiKey: config.apiKey }).embeddingModel(config.embeddingModel);
    case 'ollama':
      return createOllama({ baseURL: config.ollamaBaseUrl }).embedding(config.embeddingModel);
    default:
      throw new Error(`Unsupported embedding provider: ${config.provider}`);
  }
}

export const LLMProvider: Provider<LanguageModel> = {
  provide: TOKENS.LLM_PROVIDER,
  inject: [llmConfig.KEY],
  useFactory: (config: LLMConfig) => resolveModel(config),
};

export const LLMEmbeddingProvider: Provider<EmbeddingModel> = {
  provide: TOKENS.LLM_EMBEDDING_PROVIDER,
  inject: [llmConfig.KEY],
  useFactory: (config: LLMConfig) => resolveEmbeddingModel(config),
};
