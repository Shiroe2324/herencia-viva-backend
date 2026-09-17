import { Module } from '@nestjs/common';

import { LLMService } from '@/llm/llm.service';
import { LLMEmbeddingProvider, LLMProvider } from '@/providers';

@Module({
  providers: [LLMProvider, LLMEmbeddingProvider, LLMService],
  exports: [LLMService],
})
export class LLMModule {}
