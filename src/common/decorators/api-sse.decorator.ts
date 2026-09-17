import { applyDecorators } from '@nestjs/common';
import type { Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiOperation, ApiProperty, getSchemaPath } from '@nestjs/swagger';

import type { ApiSseEvent, ApiSseEventConfig, ApiSseOptions } from '@/types';

export const NoPayload = Symbol('NoPayload');

function normalizeEvent(event: ApiSseEventConfig): ApiSseEvent {
  if (event === NoPayload) return { dto: NoPayload };
  if (typeof event === 'function') return { dto: event };
  return event;
}

function toEventSchemaName(eventName: string): string {
  const normalized = eventName
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return `${normalized}SseEvent`;
}

const eventClassCache = new Map<string, Type>();

function getOrCreateEventClass(eventName: string, event: ApiSseEvent): Type {
  const schemaName = toEventSchemaName(eventName);

  const CachedCls = eventClassCache.get(schemaName);
  if (CachedCls) return CachedCls;

  const EventClass = class {};
  Object.defineProperty(EventClass, 'name', { value: schemaName });
  ApiProperty({ type: String, enum: [eventName], description: 'Event type identifier' })(EventClass.prototype, 'event');
  ApiProperty({ type: String, description: 'Event ID for client reconnection', required: false })(EventClass.prototype, 'id');
  ApiProperty({ type: Number, description: 'Reconnection delay in milliseconds', required: false })(EventClass.prototype, 'retry');

  if (event.dto !== NoPayload) {
    ApiProperty({
      type: () => event.dto as Type,
      description: `Payload for ${eventName}`,
    })(EventClass.prototype, 'data');
  }

  eventClassCache.set(schemaName, EventClass as Type);
  return EventClass as Type;
}

export function ApiSse(options: ApiSseOptions) {
  const normalizedEvents = Object.fromEntries(Object.entries(options.events).map(([name, event]) => [name, normalizeEvent(event)]));
  const eventClasses = Object.entries(normalizedEvents).map(([name, event]) => getOrCreateEventClass(name, event));
  const payloadDtos = Object.values(normalizedEvents)
    .filter((e) => e.dto !== NoPayload)
    .map((e) => e.dto as Type);

  const allModels = [...eventClasses, ...payloadDtos];
  const oneOf = eventClasses.map((cls) => ({ $ref: getSchemaPath(cls) }));
  const discriminatorMapping = Object.fromEntries(
    Object.keys(normalizedEvents).map((eventName) => [eventName, getSchemaPath(getOrCreateEventClass(eventName, normalizedEvents[eventName]))]),
  );

  return applyDecorators(
    ApiExtraModels(...allModels),
    ...(options.summary ? [ApiOperation({ summary: options.summary })] : []),
    ApiOkResponse({
      description: options.description ?? 'Server-Sent Events stream',
      content: { 'text/event-stream': { schema: { oneOf, discriminator: { propertyName: 'type', mapping: discriminatorMapping } } } },
    }),
  );
}
