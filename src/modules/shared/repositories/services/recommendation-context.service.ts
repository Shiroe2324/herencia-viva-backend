import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { RecommendationContextEntity } from '@/database/entities/recommendation-context.entity';
import type { RecommendationContextModel } from '@/models';
import { CoreService } from '@/repositories/services/core.service';
import { Mappers } from '@/utils';

@Injectable()
export class RecommendationContextRepositoryService extends CoreService<RecommendationContextEntity, RecommendationContextModel> {
  constructor(
    @InjectRepository(RecommendationContextEntity) private readonly recommendationContextRepository: Repository<RecommendationContextEntity>,
  ) {
    super(recommendationContextRepository, Mappers.RecommendationContext);
  }

  public findOneById(id: string, withDeleted = false): Promise<RecommendationContextModel | null> {
    return this.findOneBy({ id }, withDeleted);
  }

  public async findByIds(ids: string[], withDeleted = false): Promise<RecommendationContextModel[]> {
    if (ids.length === 0) return [];
    const entities = await this.recommendationContextRepository.find({ where: { id: In(ids) }, withDeleted });
    return entities.map((entity) => this.mapper.toModel(entity));
  }

  public async save(context: RecommendationContextModel): Promise<RecommendationContextModel> {
    const saved = await this.recommendationContextRepository.save(this.mapper.toEntity(context));
    return this.mapper.toModel(saved);
  }
}
