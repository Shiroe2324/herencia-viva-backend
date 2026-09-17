import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { toSnakeCase } from '@/utils';

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  return Object.prototype.toString.call(value) === '[object Object]';
};

const transform = (data: unknown): unknown => {
  if (Array.isArray(data)) {
    return data.map(transform);
  }

  if (data instanceof Date) {
    return data;
  }

  if (isPlainObject(data)) {
    return Object.entries(data).reduce<Record<string, unknown>>((acc, [key, value]) => {
      acc[toSnakeCase(key)] = transform(value);
      return acc;
    }, {});
  }

  return data;
};

@Injectable()
export class SnakeCaseInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map(transform));
  }
}
