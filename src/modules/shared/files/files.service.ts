import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import type { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';

import { MinioConfig, minioConfig } from '@/configs';
import { TOKENS } from '@/constants';
import type { Files, FileUploadResult } from '@/types';

@Injectable()
export class FilesService implements Files {
  constructor(
    @Inject(TOKENS.MINIO) private readonly s3: S3Client,
    @Inject(minioConfig.KEY) private readonly minioCfg: MinioConfig,
  ) {}

  public async uploadFile(file: Express.Multer.File | Buffer, folder = 'default', tags: Record<string, string> = {}): Promise<FileUploadResult> {
    const bucket = this.minioCfg.bucket;
    const buffer = Buffer.isBuffer(file) ? file : file.buffer;

    const { fileTypeFromBuffer } = await import('file-type');
    const typeInfo = await fileTypeFromBuffer(buffer);
    const ext = typeInfo?.ext || 'bin';
    const ContentType = typeInfo?.mime || 'application/octet-stream';
    const Key = this.getKey(folder, ext);
    const originalFileName = Buffer.isBuffer(file) ? `file.${ext}` : file.originalname;
    const Tagging = this.getTags(tags);

    const objectCreated = new PutObjectCommand({
      Bucket: bucket,
      Key,
      Body: buffer,
      ContentType,
      Tagging,
      Metadata: { originalFileName },
      ContentDisposition: 'inline',
    });

    await this.s3.send(objectCreated);

    return { key: Key, url: await this.getPresignedUrl(Key) };
  }

  public async deleteFile(key: string): Promise<boolean> {
    const bucket = this.minioCfg.bucket;
    await this.s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  }

  private async getPresignedUrl(key: string): Promise<string> {
    const bucket = this.minioCfg.bucket;
    return getSignedUrl(this.s3, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 60 * 60 });
  }

  private getKey(folder: string, ext: string = '') {
    const suffix = ext ? `.${ext}` : '';
    return `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}${suffix}`;
  }

  private getTags(tags: Record<string, string>) {
    return Object.entries(tags)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }
}
