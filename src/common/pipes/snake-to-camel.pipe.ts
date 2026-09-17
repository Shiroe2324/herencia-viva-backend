import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { toCamelCase } from '@/utils';

// Only recurse into plain objects/arrays. Class instances (Date, Buffer, entities, ...) are passed
// through untouched: spreading their entries would drop their prototype and, for Date, collapse
// them to `{}`.
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  return Object.prototype.toString.call(value) === '[object Object]';
};

const transformKeys = (data: unknown): unknown => {
  if (Array.isArray(data)) {
    return data.map(transformKeys);
  }

  if (isPlainObject(data)) {
    return Object.entries(data).reduce<Record<string, unknown>>((acc, [key, value]) => {
      acc[toCamelCase(key)] = transformKeys(value);
      return acc;
    }, {});
  }

  return data;
};

// Argument kinds whose keys arrive from the client as snake_case and need converting.
const TRANSFORMABLE_ARG_TYPES: ReadonlySet<ArgumentMetadata['type']> = new Set(['body', 'query', 'param']);

@Injectable()
export class SnakeToCamelPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (!TRANSFORMABLE_ARG_TYPES.has(metadata.type)) return value;
    return transformKeys(value);
  }
}
