import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';

import type { ClientMeta as ClientMetaType } from '@/types';

export const ClientMeta = createParamDecorator((_data: unknown, ctx: ExecutionContext): ClientMetaType => {
  const request = ctx.switchToHttp().getRequest();

  const ipAddress = request.ip ?? request.socket?.remoteAddress ?? null;
  const userAgent = request.headers?.['user-agent'] ?? null;

  return { ipAddress, userAgent };
});
