import type { Provider } from '@nestjs/common';
import Redis from 'ioredis';

import type { RedisConfig } from '@/configs';
import { redisConfig } from '@/configs';
import { TOKENS } from '@/constants';

export const RedisProvider: Provider<Redis> = {
  provide: TOKENS.REDIS,
  inject: [redisConfig.KEY],
  useFactory: (config: RedisConfig) => {
    return new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      username: config.username,
    });
  },
};
