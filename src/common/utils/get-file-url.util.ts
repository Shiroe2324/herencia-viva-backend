import { MINIO_PUBLIC_URL } from '@/configs';

export function getFileUrl(fileKey?: string | null): string | null {
  if (!fileKey) return null;
  return `${MINIO_PUBLIC_URL}/${fileKey}`;
}
