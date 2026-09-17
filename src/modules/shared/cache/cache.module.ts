import { Module } from '@nestjs/common';

import { GenericCacheService } from '@/cache/generic-cache.service';
import { OtpSessionCacheService } from '@/cache/otp-session-cache.service';
import { RedisProvider } from '@/providers';

@Module({
  providers: [RedisProvider, GenericCacheService, OtpSessionCacheService],
  exports: [GenericCacheService, OtpSessionCacheService],
})
export class CacheModule {}
