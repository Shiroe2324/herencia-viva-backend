import {
  type FindOperator,
  type FindOptionsRelations,
  type FindOptionsSelect,
  type ObjectLiteral,
  Between as TypeormBetween,
  Equal as TypeormEqual,
  ILike as TypeormILike,
  In as TypeormIn,
  IsNull as TypeormIsNull,
  LessThan as TypeormLessThan,
  LessThanOrEqual as TypeormLessThanOrEqual,
  Like as TypeormLike,
  MoreThan as TypeormMoreThan,
  MoreThanOrEqual as TypeormMoreThanOrEqual,
  Not as TypeormNot,
  Raw as TypeormRaw,
} from 'typeorm';

export const Not = <T>(value: T) => TypeormNot(value);
export const Equal = <T>(value: T) => TypeormEqual(value);
export const In = <T>(values: T[]) => TypeormIn(values);
export const Between = <T>(from: T, to: T) => TypeormBetween(from, to);

export const MoreThan = <T>(value: T) => TypeormMoreThan(value);
export const MoreThanOrEqual = <T>(value: T) => TypeormMoreThanOrEqual(value);
export const LessThan = <T>(value: T) => TypeormLessThan(value);
export const LessThanOrEqual = <T>(value: T) => TypeormLessThanOrEqual(value);

export const Like = (pattern: string) => TypeormLike(pattern);
export const ILike = (pattern: string) => TypeormILike(pattern);

export const IsNull = () => TypeormIsNull();

export function Raw(expression: string): ReturnType<typeof TypeormRaw>;
export function Raw(expression: (alias: string) => string): ReturnType<typeof TypeormRaw>;
export function Raw(expression: string | ((alias: string) => string)) {
  if (typeof expression === 'string') {
    return TypeormRaw(expression);
  }
  return TypeormRaw(expression as (alias: string) => string);
}

export const StartsWith = (value: string, insensitive = true) => (insensitive ? ILike(`${value}%`) : Like(`${value}%`));
export const EndsWith = (value: string, insensitive = true) => (insensitive ? ILike(`%${value}`) : Like(`%${value}`));
export const Contains = (value: string, insensitive = true) => (insensitive ? ILike(`%${value}%`) : Like(`%${value}%`));

export type OrmType = 'typeorm' | 'prisma' | 'drizzle' | 'custom';
export interface OrmOperators {
  Not: typeof Not;
  Equal: typeof Equal;
  In: typeof In;
  Between: typeof Between;
  MoreThan: typeof MoreThan;
  MoreThanOrEqual: typeof MoreThanOrEqual;
  LessThan: typeof LessThan;
  LessThanOrEqual: typeof LessThanOrEqual;
  Like: typeof Like;
  ILike: typeof ILike;
  IsNull: typeof IsNull;
  Raw: typeof Raw;
  StartsWith: typeof StartsWith;
  EndsWith: typeof EndsWith;
  Contains: typeof Contains;
}

export const ORM: OrmOperators = {
  Not,
  Equal,
  In,
  Between,
  MoreThan,
  MoreThanOrEqual,
  LessThan,
  LessThanOrEqual,
  Like,
  ILike,
  IsNull,
  Raw,
  StartsWith,
  EndsWith,
  Contains,
};

export const isOrmOperator = (value: unknown): value is FindOperator<unknown> => !!value && typeof value === 'object' && '__type__' in value;
export const resolveOrmValue = <T>(value: T): T => value;
export const createOrmUtils = (impl: Partial<OrmOperators>): OrmOperators => ({ ...ORM, ...impl });

export interface SelectAndRelations<E extends ObjectLiteral> {
  select: FindOptionsSelect<E> | undefined;
  relations: FindOptionsRelations<E> | undefined;
}

/**
 * Turns a flat `select` array (supporting one level of `relation.field` dot-notation, e.g. `picture.url`)
 * into TypeORM's nested `select`/`relations` shape, joining a relation only when it (or one of its fields) was requested.
 */
export function buildSelectAndRelations<E extends ObjectLiteral>(
  select: string[] | undefined,
  relationKeys: readonly string[],
): SelectAndRelations<E> {
  if (!select || select.length === 0) return { select: undefined, relations: undefined };

  const selectObj: Record<string, unknown> = {};
  const relationsObj: Record<string, true> = {};

  for (const field of select) {
    const [head, ...rest] = field.split('.');
    if (!head || !relationKeys.includes(head)) {
      selectObj[head] = true;
      continue;
    }

    relationsObj[head] = true;

    if (rest.length === 0 || selectObj[head] === true) {
      selectObj[head] = true;
      continue;
    }

    const current = typeof selectObj[head] === 'object' ? (selectObj[head] as Record<string, unknown>) : {};
    selectObj[head] = { ...current, [rest.join('.')]: true };
  }

  return {
    select: selectObj as FindOptionsSelect<E>,
    relations: Object.keys(relationsObj).length > 0 ? (relationsObj as FindOptionsRelations<E>) : undefined,
  };
}
