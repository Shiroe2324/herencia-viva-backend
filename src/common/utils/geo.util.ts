import { lookup } from 'geoip-lite';

import type { ResolvedGeoLocation } from '@/types';

const PRIVATE_IP_PATTERN = /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|::1$|fc00:|fe80:|::ffff:127\.|::ffff:10\.|::ffff:192\.168\.)/;

export function resolveGeoLocation(ipAddress: string | null): ResolvedGeoLocation {
  if (!ipAddress || PRIVATE_IP_PATTERN.test(ipAddress)) return { country: null, city: null };

  const location = lookup(ipAddress);
  if (!location) return { country: null, city: null };

  return { country: location.country || null, city: location.city || null };
}
