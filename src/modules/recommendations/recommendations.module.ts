import { Module } from '@nestjs/common';

import { CacheModule } from '@/cache/cache.module';
import { ChromaModule } from '@/chroma/chroma.module';
import { LLMModule } from '@/llm/llm.module';
import { RecommendationsChatsController } from '@/recommendations/controllers/recommendations-chats.controller';
import { RecommendationsContextsController } from '@/recommendations/controllers/recommendations-contexts.controller';
import { RecommendationsLLMController } from '@/recommendations/controllers/recommendations-llm.controller';
import { RecommendationsChatCacheService } from '@/recommendations/services/recommendations-chat-cache.service';
import { RecommendationsChatsService } from '@/recommendations/services/recommendations-chats.service';
import { RecommendationsContextRetrievalService } from '@/recommendations/services/recommendations-context-retrieval.service';
import { RecommendationsContextsService } from '@/recommendations/services/recommendations-contexts.service';
import { RecommendationsLLMService } from '@/recommendations/services/recommendations-llm.service';
import { RecommendationsPromptService } from '@/recommendations/services/recommendations-prompt.service';
import { RepositoriesModule } from '@/repositories/repositories.module';

@Module({
  imports: [LLMModule, CacheModule, ChromaModule, RepositoriesModule],
  controllers: [RecommendationsLLMController, RecommendationsChatsController, RecommendationsContextsController],
  providers: [
    RecommendationsChatCacheService,
    RecommendationsChatsService,
    RecommendationsContextRetrievalService,
    RecommendationsContextsService,
    RecommendationsLLMService,
    RecommendationsPromptService,
  ],
  exports: [
    RecommendationsChatCacheService,
    RecommendationsChatsService,
    RecommendationsContextRetrievalService,
    RecommendationsContextsService,
    RecommendationsLLMService,
    RecommendationsPromptService,
  ],
})
export class RecommendationsModule {}
