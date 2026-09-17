import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { RECOMMENDATIONS_ERROR_CODES } from '@/constants';
import type { RecommendationChatMessageModel, RecommendationChatModel } from '@/models';
import { GetAllChatsRequest, GetAllChatsResponse, PatchRecommendationChatRequest } from '@/recommendations/dtos/chats';
import { RecommendationsChatCacheService } from '@/recommendations/services/recommendations-chat-cache.service';
import { RecommendationChatRepositoryService } from '@/repositories/services/recommendation-chat.service';

@Injectable()
export class RecommendationsChatsService {
  constructor(
    private readonly chatCacheService: RecommendationsChatCacheService,
    private readonly recommendationChatRepository: RecommendationChatRepositoryService,
  ) {}

  public async getAll(userId: string, query: GetAllChatsRequest): Promise<GetAllChatsResponse> {
    const { orderBy, orderDirection, page, limit } = query;

    const { data, ...pagination } = await this.recommendationChatRepository.paginate({
      orderBy,
      orderDirection,
      page,
      limit,
      relations: { messages: true },
      filters: { user: { id: userId } },
    });

    const messagesSorting = (a: RecommendationChatMessageModel, b: RecommendationChatMessageModel): number => {
      if (!a && !b) return 0;
      if (!a) return orderDirection === 'ASC' ? -1 : 1;
      return orderDirection === 'ASC' ? a.createdAt.getTime() - b.createdAt.getTime() : b.createdAt.getTime() - a.createdAt.getTime();
    };

    const chats = data.map((chat) => ({ ...chat, messages: chat.messages?.sort(messagesSorting) || [] }));

    return { chats, ...pagination };
  }

  public async getOne(userId: string, chatId: string): Promise<RecommendationChatModel> {
    const chat = await this.recommendationChatRepository.findOneByIdAndUser(chatId, userId);
    if (!chat) throw new NotFoundException(RECOMMENDATIONS_ERROR_CODES.CHAT_NOT_FOUND);
    return chat;
  }

  public async patch(userId: string, chatId: string, data: PatchRecommendationChatRequest): Promise<RecommendationChatModel> {
    const chat = await this.getOne(userId, chatId);

    const changes = Object.keys(data).filter((key) => data[key as keyof PatchRecommendationChatRequest] !== undefined);
    if (changes.length === 0) throw new ConflictException(RECOMMENDATIONS_ERROR_CODES.CHAT_NO_CHANGES);

    await this.recommendationChatRepository.update({ id: chat.id }, data);
    await this.chatCacheService.invalidate(userId, chat.id);
    return this.getOne(userId, chatId);
  }

  public async delete(userId: string, chatId: string): Promise<RecommendationChatModel> {
    const chat = await this.getOne(userId, chatId);
    await this.recommendationChatRepository.delete({ id: chat.id });
    await this.chatCacheService.invalidate(userId, chat.id);
    return chat;
  }
}
