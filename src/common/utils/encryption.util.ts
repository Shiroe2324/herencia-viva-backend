import * as crypto from 'crypto';

import { ENCRYPTION_ALGORITHM, ENCRYPTION_IV_LENGTH, ENCRYPTION_KEY } from '@/configs';

export function encrypt(content: string): string {
  const iv = crypto.randomBytes(ENCRYPTION_IV_LENGTH);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);

  let encrypted = cipher.update(content, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag();

  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
}

export function decrypt(encryptedContent: string): string {
  const [ivStr, authTagStr, encryptedData] = encryptedContent.split(':');
  if (!ivStr || !authTagStr || !encryptedData) throw new Error('Invalid token format');

  const iv = Buffer.from(ivStr, 'base64');
  const authTag = Buffer.from(authTagStr, 'base64');

  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export function createHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function compareHash(data: string, hashedValue: string): boolean {
  const dataHash = createHash(data);

  const a = Buffer.from(dataHash, 'hex');
  const b = Buffer.from(hashedValue, 'hex');

  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${derivedKey}`;
}

export function comparePassword(password: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;

  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

  const a = Buffer.from(key, 'hex');
  const b = Buffer.from(derivedKey, 'hex');

  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}
