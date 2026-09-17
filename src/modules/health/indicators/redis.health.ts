import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import Redis from 'ioredis';

import { TOKENS } from '@/constants';

@Injectable()
export class RedisHealthIndicator {
  constructor(
    private readonly healthIndicator: HealthIndicatorService,
    @Inject(TOKENS.REDIS) private readonly redis: Redis,
  ) {}

  public async isHealthy(key: string) {
    const indicator = this.healthIndicator.check(key);

    try {
      await this.redis.ping();
      return indicator.up();
    } catch (error) {
      return indicator.down({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
