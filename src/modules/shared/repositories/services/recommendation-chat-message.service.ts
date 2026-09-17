import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RecommendationChatMessageEntity } from '@/database/entities/recommendation-chat-message.entity';
import { LLMChatRole } from '@/enums';
import type { RecommendationChatMessageModel } from '@/models';
import { CoreService } from '@/repositories/services/core.service';
import { Mappers } from '@/utils';

@Injectable()
export class RecommendationChatMessageRepositoryService extends CoreService<RecommendationChatMessageEntity, RecommendationChatMessageModel> {
  constructor(
    @InjectRepository(RecommendationChatMessageEntity)
    private readonly recommendationChatMessageRepository: Repository<RecommendationChatMessageEntity>,
  ) {
    super(recommendationChatMessageRepository, Mappers.RecommendationChatMessage);
  }

  public async createForChat(chatId: string, role: LLMChatRole, content: string): Promise<RecommendationChatMessageModel> {
    const entity = this.recommendationChatMessageRepository.create({ chat: { id: chatId }, role, content });
    const saved = await this.recommendationChatMessageRepository.save(entity);
    return this.mapper.toModel(saved);
  }
}
