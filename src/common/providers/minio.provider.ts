import { S3Client } from '@aws-sdk/client-s3';
import type { Provider } from '@nestjs/common';

import type { MinioConfig } from '@/configs';
import { minioConfig } from '@/configs';
import { TOKENS } from '@/constants';

export const MinioProvider: Provider<S3Client> = {
  provide: TOKENS.MINIO,
  inject: [minioConfig.KEY],
  useFactory: (config: MinioConfig) => {
    return new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      credentials: { accessKeyId: config.accessKey, secretAccessKey: config.secretKey },
      forcePathStyle: true,
    });
  },
};
