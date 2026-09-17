import type { DeepPartial, EntityManager, FindOptionsOrder, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

import { GetAllOrderDirection } from '@/enums';
import type { PaginationOptions, RepositoryMapper } from '@/types';
import { buildSelectAndRelations } from '@/utils';

export abstract class CoreService<E extends ObjectLiteral, M> {
  protected constructor(
    protected readonly repository: Repository<E>,
    protected readonly mapper: RepositoryMapper<M, E>,
  ) {}

  public async findOneBy(where: FindOptionsWhere<E> | FindOptionsWhere<E>[], withDeleted = false): Promise<M | null> {
    const entity = await this.repository.findOne({ where, withDeleted });
    return entity ? this.mapper.toModel(entity) : null;
  }

  public async findBy(where: FindOptionsWhere<E> | FindOptionsWhere<E>[], withDeleted = false): Promise<M[]> {
    const entities = await this.repository.find({ where, withDeleted });
    return entities.map((e) => this.mapper.toModel(e));
  }

  public async findAll(): Promise<M[]> {
    const entities = await this.repository.find();
    return entities.map((e) => this.mapper.toModel(e));
  }

  public async existsBy(where: FindOptionsWhere<E> | FindOptionsWhere<E>[], withDeleted = false): Promise<boolean> {
    return this.repository.exists({ where, withDeleted });
  }

  public async countBy(where?: FindOptionsWhere<E> | FindOptionsWhere<E>[], withDeleted = false): Promise<number> {
    return this.repository.count({ where, withDeleted });
  }

  public async paginate(params: PaginationOptions<E>) {
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(params.limit ?? 10, 100);
    const skip = (page - 1) * limit;

    const where = params.filters ?? {};
    const orderField = params.orderBy ?? 'createdAt';
    const orderDir = params.orderDirection ?? GetAllOrderDirection.DESC;
    const withDeleted = params.withDeleted ?? false;
    const selectFields = params.select && params.select.length > 0 ? [...new Set([...params.select, orderField])] : params.select;
    const { select, relations: computedRelations } = buildSelectAndRelations<E>(selectFields, params.relationKeys ?? []);
    const relations = params.relations ?? computedRelations;

    const order = { [orderField]: orderDir } as FindOptionsOrder<E>;

    const [entities, total] = await this.repository.findAndCount({ where, order, skip, take: limit, withDeleted, select, relations });
    const data = entities.map((e) => this.mapper.toModel(e));

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  public async create(data: DeepPartial<M>): Promise<M> {
    const entity = this.repository.create(this.mapper.toEntity(data));
    const saved = await this.repository.save(entity);
    return this.mapper.toModel(saved);
  }

  public async createMany(data: DeepPartial<M>[]): Promise<M[]> {
    const entities = data.map((d) => this.mapper.toEntity(d));
    const saved = await this.repository.save(entities);
    return saved.map((e) => this.mapper.toModel(e));
  }

  public async update(where: FindOptionsWhere<E> | FindOptionsWhere<E>[], data: DeepPartial<M>): Promise<void> {
    await this.repository.update(where, this.mapper.toEntity(data));
  }

  public async delete(where: FindOptionsWhere<E> | FindOptionsWhere<E>[]) {
    return this.repository.delete(where);
  }

  public async softDelete(where: FindOptionsWhere<E> | FindOptionsWhere<E>[]) {
    return this.repository.softDelete(where);
  }

  public async restore(where: FindOptionsWhere<E> | FindOptionsWhere<E>[]) {
    return this.repository.restore(where);
  }

  protected async transaction<R>(work: (manager: EntityManager) => Promise<R>): Promise<R> {
    return this.repository.manager.transaction(work);
  }
}
