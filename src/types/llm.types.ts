import type { LanguageModel, ModelMessage } from 'ai';

import type { LLMChatRole } from '@/enums';

export interface LLMChatHistoryItem {
  role: LLMChatRole;
  content: string;
}

export interface LLMChatRequestParams extends LLMGenerationConfig {
  model: LanguageModel;
  system: string;
  messages: ModelMessage[];
}

export interface LLMChatSession {
  sendMessage(message: string): Promise<string>;
  sendMessageStream(message: string): AsyncIterable<string>;
}

export interface LLMGenerationConfig {
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
  candidateCount?: number;
}

export interface LLM {
  createChat(systemPrompt: string, history: LLMChatHistoryItem[], generationConfig?: LLMGenerationConfig): LLMChatSession;
  embedText(prompt: string): Promise<number[]>;
  generateText(prompt: string, generationConfig?: LLMGenerationConfig): Promise<string>;
}
