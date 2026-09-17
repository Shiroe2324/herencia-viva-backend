import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { TOKENS } from '@/constants';
import type { OtpSession } from '@/types';

@Injectable()
export class OtpSessionCacheService {
  private readonly PREFIX = 'otp:session:';
  private readonly DEFAULT_TTL = 300;

  constructor(@Inject(TOKENS.REDIS) private readonly redis: Redis) {}

  private getKey(sessionId: string): string {
    return `${this.PREFIX}${sessionId}`;
  }

  public async get(sessionId: string): Promise<OtpSession | null> {
    const data = await this.redis.get(this.getKey(sessionId));
    return data ? JSON.parse(data) : null;
  }

  public async set(sessionId: string, userId: string): Promise<void> {
    const session: OtpSession = { userId, createdAt: new Date().toISOString() };
    await this.redis.setex(this.getKey(sessionId), this.DEFAULT_TTL, JSON.stringify(session));
  }

  public async delete(sessionId: string): Promise<void> {
    await this.redis.del(this.getKey(sessionId));
  }

  public async exists(sessionId: string): Promise<boolean> {
    return (await this.redis.exists(this.getKey(sessionId))) === 1;
  }

  public async getRemainingTtl(sessionId: string): Promise<number> {
    return await this.redis.ttl(this.getKey(sessionId));
  }

  public async deleteAllUserSessions(userId: string): Promise<number> {
    const pattern = `${this.PREFIX}*`;
    const keys = await this.redis.keys(pattern);

    if (keys.length === 0) return 0;

    const pipeline = this.redis.pipeline();
    let count = 0;

    for (const key of keys) {
      const data = await this.redis.get(key);
      if (!data) continue;

      const session: OtpSession = JSON.parse(data);
      if (session.userId !== userId) continue;

      pipeline.del(key);
      count++;
    }

    if (count > 0) await pipeline.exec();
    return count;
  }
}
