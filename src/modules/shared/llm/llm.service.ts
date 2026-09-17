import { Inject, Injectable } from '@nestjs/common';
import { embed, generateText, Output, streamText } from 'ai';
import type { EmbeddingModel, LanguageModel, ModelMessage } from 'ai';
import type { ZodType } from 'zod';

import { TOKENS } from '@/constants';
import type { LLM, LLMChatHistoryItem, LLMChatRequestParams, LLMChatSession, LLMGenerationConfig } from '@/types';
import { withRetry } from '@/utils';

@Injectable()
export class LLMService implements LLM {
  constructor(
    @Inject(TOKENS.LLM_PROVIDER) private readonly model: LanguageModel,
    @Inject(TOKENS.LLM_EMBEDDING_PROVIDER) private readonly embeddingModel: EmbeddingModel,
  ) {}

  public createChat(systemPrompt: string, history: LLMChatHistoryItem[], generationConfig?: LLMGenerationConfig): LLMChatSession {
    const baseMessages = this.toModelMessages(history);
    const model = this.model;

    const buildParams = (message: string): LLMChatRequestParams => ({
      model,
      system: systemPrompt,
      messages: [...baseMessages, { role: 'user', content: message }],
      ...generationConfig,
    });

    return {
      sendMessage: async (message: string) => {
        const result = await withRetry(() => generateText(buildParams(message)));
        return result.text.trim();
      },
      async *sendMessageStream(message: string) {
        const result = streamText(buildParams(message));
        yield* result.textStream;
      },
    };
  }

  public async embedText(text: string): Promise<number[]> {
    const { embedding } = await embed({ model: this.embeddingModel, value: text });
    return embedding;
  }

  public async generateText(prompt: string, generationConfig?: LLMGenerationConfig): Promise<string> {
    const result = await withRetry(() => generateText({ model: this.model, prompt, ...generationConfig }));
    return result.text.trim();
  }

  public async generateStructured<T>(prompt: string, schema: ZodType<T>, generationConfig?: LLMGenerationConfig): Promise<T> {
    const result = await withRetry(() => generateText({ model: this.model, prompt, output: Output.object({ schema }), ...generationConfig }));
    return result.output;
  }

  private toModelMessages(history: LLMChatHistoryItem[]): ModelMessage[] {
    return history.map((item) => ({ role: item.role, content: item.content }));
  }
}
