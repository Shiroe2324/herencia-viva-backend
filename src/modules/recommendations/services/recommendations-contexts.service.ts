import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { ChromaService } from '@/chroma/chroma.service';
import { RECOMMENDATIONS_ERROR_CODES } from '@/constants';
import { LLMService } from '@/llm/llm.service';
import { RecommendationContextModel } from '@/models';
import {
  CreateContextRequest,
  GetAllRecommendationContextsRequest,
  GetAllRecommendationContextsResponse,
  PatchRecommendationContextRequest,
} from '@/recommendations/dtos/contexts';
import { RecommendationContextRepositoryService } from '@/repositories/services/recommendation-context.service';
import type { ChromaUpsertRecord } from '@/types';

@Injectable()
export class RecommendationsContextsService {
  constructor(
    private readonly chromaService: ChromaService,
    private readonly llmService: LLMService,
    private readonly recommendationContextRepository: RecommendationContextRepositoryService,
    @InjectPinoLogger(RecommendationsContextsService.name) private readonly logger: PinoLogger,
  ) {}

  public async getAll(query: GetAllRecommendationContextsRequest): Promise<GetAllRecommendationContextsResponse> {
    const { orderBy, orderDirection, page, limit } = query;
    const { data, ...pagination } = await this.recommendationContextRepository.paginate({ orderBy, orderDirection, page, limit });
    return { contexts: data, ...pagination };
  }

  public async getOne(contextId: string): Promise<RecommendationContextModel> {
    const context = await this.recommendationContextRepository.findOneById(contextId);
    if (!context) throw new NotFoundException(RECOMMENDATIONS_ERROR_CODES.CONTEXT_NOT_FOUND);
    return context;
  }

  public async create(data: CreateContextRequest): Promise<RecommendationContextModel> {
    const context = await this.recommendationContextRepository.create({ question: data.question, answer: data.answer, tags: data.tags });
    await this.syncContextToChroma(context, 'create');
    return context;
  }

  public async patch(contextId: string, data: PatchRecommendationContextRequest): Promise<RecommendationContextModel> {
    const context = await this.getOne(contextId);

    const changes = Object.keys(data).filter((key) => data[key as keyof PatchRecommendationContextRequest] !== undefined);
    if (changes.length === 0) throw new ConflictException(RECOMMENDATIONS_ERROR_CODES.CONTEXT_NO_CHANGES);

    await this.recommendationContextRepository.update({ id: context.id }, data);
    const updated = await this.getOne(contextId);
    await this.syncContextToChroma(updated, 'patch');
    return updated;
  }

  public async delete(contextId: string): Promise<RecommendationContextModel> {
    const context = await this.getOne(contextId);
    await this.recommendationContextRepository.softDelete({ id: context.id });
    await this.deleteContextFromChroma(context.id);
    return context;
  }

  private buildDocument(question: string, answer: string, tags?: string[] | null): string {
    const tagsString = tags && tags.length > 0 ? `Etiquetas: ${tags.join(', ')}` : 'Etiquetas: Ninguna';
    return `Pregunta: ${question.trim()}\nRespuesta: ${answer.trim()}\n${tagsString}`;
  }

  private async syncContextToChroma(context: RecommendationContextModel, operation: 'create' | 'patch'): Promise<void> {
    const document = this.buildDocument(context.question, context.answer, context.tags);

    try {
      const embedding = await this.llmService.embedText(document);

      const record: ChromaUpsertRecord = {
        id: context.id,
        document,
        embedding,
        metadata: {
          question: context.question,
          answer: context.answer,
          tags: context.tags || [],
        },
      };

      await this.chromaService.upsertRecords([record]);
    } catch (error) {
      this.logger.warn({ err: error, contextId: context.id, operation }, 'Recommendation context saved but failed to sync to Chroma');
    }
  }

  private async deleteContextFromChroma(contextId: string): Promise<void> {
    try {
      await this.chromaService.delete({ ids: [contextId] });
    } catch (error) {
      this.logger.warn({ err: error, contextId }, 'Recommendation context removed from relational storage but failed to remove from Chroma');
    }
  }
}
