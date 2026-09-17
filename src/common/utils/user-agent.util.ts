import { UAParser } from 'ua-parser-js';

import type { ParsedUserAgent } from '@/types';

export function parseUserAgent(userAgent: string | null): ParsedUserAgent {
  if (!userAgent) return { browser: null, os: null, deviceType: null };

  const { browser, os, device } = UAParser(userAgent);

  return {
    browser: browser.name ?? null,
    os: os.name ?? null,
    deviceType: device.type ?? 'desktop',
  };
}
