import type { RetryOptions } from '@/types';

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 500, retryableStatusCodes = [503, 429] } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const status = error?.status ?? error?.response?.status;
      const isRetryable = retryableStatusCodes.includes(status);
      const isLastAttempt = attempt === maxRetries;

      if (!isRetryable || isLastAttempt) throw error;

      const delay = baseDelayMs * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
