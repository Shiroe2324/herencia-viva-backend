import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiskHealthIndicator, HealthCheck, HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';

import { LimitsConfig, limitsConfig } from '@/configs';
import { HEALTH_CORE_TAG } from '@/constants';
import { MinioHealthIndicator } from '@/health/indicators/minio.health';
import { RedisHealthIndicator } from '@/health/indicators/redis.health';

@ApiTags(HEALTH_CORE_TAG.NAME)
@Controller('health')
export class HealthCoreController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly dbIndicator: TypeOrmHealthIndicator,
    private readonly diskIndicator: DiskHealthIndicator,
    private readonly memoryIndicator: MemoryHealthIndicator,
    private readonly redisIndicator: RedisHealthIndicator,
    private readonly minioIndicator: MinioHealthIndicator,
    @Inject(limitsConfig.KEY) private readonly limitsCfg: LimitsConfig,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health Check', description: 'Check the health status of the application' })
  @HealthCheck()
  public check() {
    const diskThresholdPercent = this.limitsCfg.maxDiskUsagePercent;
    const memoryHeapThreshold = this.limitsCfg.maxMemoryHeapSize;
    const memoryRssThreshold = this.limitsCfg.maxMemoryRssSize;

    return this.healthService.check([
      () => this.dbIndicator.pingCheck('database'),
      () => this.diskIndicator.checkStorage('storage', { path: process.platform === 'win32' ? 'C:' : '/', thresholdPercent: diskThresholdPercent }),
      () => this.memoryIndicator.checkHeap('memory_heap', memoryHeapThreshold),
      () => this.memoryIndicator.checkRSS('memory_rss', memoryRssThreshold),
      () => this.redisIndicator.isHealthy('redis'),
      () => this.minioIndicator.isHealthy('minio'),
    ]);
  }
}
