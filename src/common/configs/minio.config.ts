import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ENV_VALIDATION_CONFIG } from '@/constants';
import type { MinioConfig as IMinioConfig } from '@/types';

const minioSchema = Joi.object<IMinioConfig>({
  MINIO_ENDPOINT: Joi.string().uri().required(),
  MINIO_BUCKET: Joi.string().required(),
  MINIO_PUBLIC_URL: Joi.string().uri().required(),
  MINIO_ROOT_USER: Joi.string().required(),
  MINIO_ROOT_PASSWORD: Joi.string().required(),
  MINIO_REGION: Joi.string().required().default('us-east-1'),
});

const { value, error } = minioSchema.validate(process.env, ENV_VALIDATION_CONFIG);
if (error) throw new Error(`MinIO configuration validation error: ${error.message}`);

export const minioConfig = registerAs('minio-config', () => ({
  endpoint: value.MINIO_ENDPOINT,
  bucket: value.MINIO_BUCKET,
  publicUrl: value.MINIO_PUBLIC_URL,
  accessKey: value.MINIO_ROOT_USER,
  secretKey: value.MINIO_ROOT_PASSWORD,
  region: value.MINIO_REGION,
}));

export type MinioConfig = ConfigType<typeof minioConfig>;

export const MINIO_PUBLIC_URL = value.MINIO_PUBLIC_URL;
