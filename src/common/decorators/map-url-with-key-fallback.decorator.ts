import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

import { getFileUrl } from '@/utils';

export function MapUrlWithKeyFallback(keyField: string = 'key') {
  return applyDecorators(
    Transform(
      ({ value, obj }) => {
        if (value) return value;

        const key = obj?.[keyField];
        return key ? getFileUrl(key) : null;
      },
      { toPlainOnly: true },
    ),
  );
}
