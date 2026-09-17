import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthCoreController } from '@/health/controllers/health-core.controller';
import { HealthNotificationsController } from '@/health/controllers/health-notifications.controller';
import { MinioHealthIndicator } from '@/health/indicators/minio.health';
import { RedisHealthIndicator } from '@/health/indicators/redis.health';
import { HealthNotificationsService } from '@/health/services/health-notifications.service';
import { MinioProvider, RedisProvider } from '@/providers';

@Module({
  imports: [TerminusModule],
  providers: [RedisProvider, MinioProvider, RedisHealthIndicator, MinioHealthIndicator, HealthNotificationsService],
  controllers: [HealthCoreController, HealthNotificationsController],
  exports: [HealthNotificationsService],
})
export class HealthModule {}
