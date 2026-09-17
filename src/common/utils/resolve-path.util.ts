import { join } from 'path';

export function resolvePath(relativePath: string): string {
  return join(__dirname, '..', '..', relativePath);
}
