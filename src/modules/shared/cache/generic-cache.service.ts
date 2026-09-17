import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { TOKENS } from '@/constants';

@Injectable()
export class GenericCacheService {
  private readonly DEFAULT_TTL = 3600;

  constructor(@Inject(TOKENS.REDIS) private readonly redis: Redis) {}

  public async set<T>(key: string, value: T, ttl: number = this.DEFAULT_TTL): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  public async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  public async delete(...keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    await this.redis.del(...keys);
  }

  public async exists(key: string): Promise<boolean> {
    return (await this.redis.exists(key)) === 1;
  }

  public async invalidatePattern(pattern: string): Promise<number> {
    const keys = await this.redis.keys(pattern);
    if (keys.length === 0) return 0;
    await this.redis.del(...keys);
    return keys.length;
  }

  public async getOrSet<T>(key: string, callback: () => Promise<T>, ttl: number = this.DEFAULT_TTL): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const result = await callback();
    await this.set(key, result, ttl);
    return result;
  }

  public buildKey(prefix: string, ...params: unknown[]): string {
    const normalizedParams = params.filter((param) => param !== undefined).map((param) => this.normalizeParam(param));
    return normalizedParams.length > 0 ? `${prefix}:${normalizedParams.join(':')}` : prefix;
  }

  private normalizeParam(param: unknown): string {
    if (param === null) return 'null';

    if (Array.isArray(param)) {
      return `[${param.map((value) => this.normalizeParam(value)).join(',')}]`;
    }

    if (typeof param === 'object') {
      const entries = Object.entries(param as Record<string, unknown>)
        .filter(([, value]) => value !== undefined)
        .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
        .map(([key, value]) => `${key}:${this.normalizeParam(value)}`);

      return `{${entries.join(',')}}`;
    }

    return String(param);
  }
}
