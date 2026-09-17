import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';

import { TOKENS } from '@/constants';

@Injectable()
export class MinioHealthIndicator {
  constructor(
    private readonly healthIndicator: HealthIndicatorService,
    @Inject(TOKENS.MINIO) private readonly s3: S3Client,
  ) {}

  public async isHealthy(key: string) {
    const indicator = this.healthIndicator.check(key);

    try {
      await this.s3.send(new ListBucketsCommand({}));
      return indicator.up();
    } catch (error) {
      return indicator.down({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
