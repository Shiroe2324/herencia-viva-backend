import { Injectable } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';

import { GenericCacheService } from '@/cache/generic-cache.service';
import { RecommendationChatModel } from '@/models';

const CHAT_CACHE_TTL_SECONDS = 900;
const CHAT_CACHE_NAMESPACE = 'recommendations:chat';

@Injectable()
export class RecommendationsChatCacheService {
  constructor(private readonly cacheService: GenericCacheService) {}

  public buildKey(userId: string, chatId: string): string {
    return this.cacheService.buildKey(CHAT_CACHE_NAMESPACE, userId, chatId);
  }

  public async get(userId: string, chatId: string): Promise<RecommendationChatModel | null> {
    const cached = await this.cacheService.get<Record<string, unknown>>(this.buildKey(userId, chatId));
    if (!cached) return null;

    const hydrated = plainToInstance(RecommendationChatModel, cached, { excludeExtraneousValues: true, enableImplicitConversion: true });
    hydrated.user = { id: userId } as RecommendationChatModel['user'];
    return hydrated;
  }

  public async set(userId: string, chat: RecommendationChatModel): Promise<void> {
    await this.cacheService.set(this.buildKey(userId, chat.id), instanceToPlain(chat), CHAT_CACHE_TTL_SECONDS);
  }

  public async invalidate(userId: string, chatId: string): Promise<void> {
    await this.cacheService.delete(this.buildKey(userId, chatId));
  }
}
