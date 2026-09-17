import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RecommendationChatEntity } from '@/database/entities/recommendation-chat.entity';
import type { RecommendationChatModel } from '@/models';
import { CoreService } from '@/repositories/services/core.service';
import { Mappers } from '@/utils';

@Injectable()
export class RecommendationChatRepositoryService extends CoreService<RecommendationChatEntity, RecommendationChatModel> {
  constructor(@InjectRepository(RecommendationChatEntity) private readonly recommendationChatRepository: Repository<RecommendationChatEntity>) {
    super(recommendationChatRepository, Mappers.RecommendationChat);
  }

  public createForUser(userId: string): RecommendationChatModel {
    const entity = this.recommendationChatRepository.create({ user: { id: userId }, title: null });
    return this.mapper.toModel(entity);
  }

  public async findOneByIdAndUser(chatId: string, userId: string): Promise<RecommendationChatModel | null> {
    const chat = await this.recommendationChatRepository.findOne({
      where: { id: chatId, user: { id: userId } },
      relations: { messages: true },
      order: { messages: { createdAt: 'ASC' } },
    });
    return chat ? this.mapper.toModel(chat) : null;
  }

  public async save(chat: RecommendationChatModel): Promise<RecommendationChatModel> {
    const saved = await this.recommendationChatRepository.save(this.mapper.toEntity(chat));
    const reloaded = await this.recommendationChatRepository.findOne({
      where: { id: saved.id },
      relations: { messages: true },
      order: { messages: { createdAt: 'ASC' } },
    });
    return this.mapper.toModel(reloaded ?? saved);
  }
}
