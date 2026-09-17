import type { Type } from '@nestjs/common';
import type { CountryCode } from 'libphonenumber-js/max';
import type { DeepPartial } from 'typeorm';
import type { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

import type { NoPayload } from '@/decorators';
import type { GetAllOrderDirection, UserRoles } from '@/enums';
import type { HttpErrorModel, ValidationErrorModel } from '@/models';

export type ModelRef<T> = T;
export type ModelRefArray<T> = T[];

export interface OtpSession {
  userId: string;
  createdAt: string;
}

export interface ClientMeta {
  ipAddress: string | null;
  userAgent: string | null;
}

export interface RepositoryMapper<M, E> {
  toEntity(model: DeepPartial<M>): E;
  toModel(entity: E): M;
}

export interface AuthJwtPayload {
  sub: string;
  iat: number;
  exp: number;
  jti: string;
  sessionId: string;
}

export interface PrivateParamRoles {
  param: string;
  exceptValues: string[];
  roles: UserRoles[];
}

export interface PaginationOptions<T> {
  page?: number;
  limit?: number;
  /** Accepts `keyof T` plus the dot-notation relation columns select also supports (e.g. `picture.url`), so it's typed as a plain string. */
  orderBy?: string;
  orderDirection?: GetAllOrderDirection;
  /** Flat select values, supporting one level of `relation.field` dot-notation (e.g. `picture.url`). */
  select?: string[];
  /** Relation property names on T that may appear (bare or dotted) in `select`; only those actually selected get joined. */
  relationKeys?: readonly string[];
  /** Escape hatch for callers with no `select`-driven pattern that still need relations unconditionally joined (e.g. no `select` field on the DTO at all). Takes precedence over `relationKeys` when set. */
  relations?: FindOptionsRelations<T>;
  filters?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  withDeleted?: boolean;
}

export interface ErrorCodeMap {
  [key: string]: string;
}

export interface ErrorCodeSection {
  title: string;
  codes: ErrorCodeMap;
}

export interface HttpExceptionResponse {
  message?: string;
  error?: string;
}

export interface FormattedValidationError {
  field: string;
  message: string;
}

export type HttpErrorBody = HttpErrorModel | ValidationErrorModel;

export type Constructor<T> = new (...args: never[]) => T;

export interface Mappable {
  constructor: { toEntity?: (obj: unknown) => unknown; toModel?: (obj: unknown) => unknown };
}

export type NoPayload = typeof NoPayload;

export interface ApiSseEvent<T = unknown> {
  dto: Type<T> | NoPayload;
  description?: string;
}

export type ApiSseEventConfig = Type<unknown> | NoPayload | ApiSseEvent;

export interface ApiSseOptions {
  summary?: string;
  description?: string;
  events: Record<string, ApiSseEventConfig>;
}

export interface OptionalValidatorOptions {
  isOptional?: boolean;
}

export interface EnumValidatorOptions extends OptionalValidatorOptions {
  enumType: object;
}

export interface PhoneNumberValidatorOptions extends OptionalValidatorOptions {
  region?: CountryCode;
}

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  retryableStatusCodes?: number[];
}

export interface ResolvedGeoLocation {
  country: string | null;
  city: string | null;
}

export interface ParsedUserAgent {
  browser: string | null;
  os: string | null;
  deviceType: string | null;
}
