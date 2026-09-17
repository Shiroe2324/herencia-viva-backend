import { Injectable } from '@nestjs/common';
import type { QueryResult } from 'chromadb';

import { ChromaService } from '@/chroma/chroma.service';
import { LLMService } from '@/llm/llm.service';
import type { RecommendationContextItem } from '@/recommendations/dtos/llm';

@Injectable()
export class RecommendationsContextRetrievalService {
  constructor(
    private readonly chromaService: ChromaService,
    private readonly llmService: LLMService,
  ) {}

  public async retrieve(question: string, limit: number): Promise<RecommendationContextItem[]> {
    const queryEmbedding = await this.llmService.embedText(question);
    const queryResult = await this.chromaService.query({ queryEmbeddings: [queryEmbedding], nResults: limit });
    return this.mapQueryResultToContext(queryResult, limit);
  }

  private mapQueryResultToContext(queryResult: QueryResult, limit: number): RecommendationContextItem[] {
    const ids = queryResult.ids?.[0] || [];
    const documents = queryResult.documents?.[0] || [];
    const metadatas = queryResult.metadatas?.[0] || [];
    const distances = queryResult.distances?.[0] || [];

    return ids.slice(0, limit).map((id, index) => {
      const metadata = metadatas[index];
      const question = this.getMetadataText(metadata, 'question');
      const answer = this.getMetadataText(metadata, 'answer');
      const tags = Array.isArray(metadata?.['tags']) ? metadata['tags'].filter((tag) => typeof tag === 'string') : [];
      const document = typeof documents[index] === 'string' ? documents[index] : undefined;
      const distance = typeof distances[index] === 'number' ? distances[index] : undefined;
      return { id, question, answer, tags, document, distance };
    });
  }

  private getMetadataText(metadata: unknown, key: string): string | undefined {
    if (!metadata || typeof metadata !== 'object') return undefined;
    const value = (metadata as Record<string, unknown>)[key];
    return typeof value === 'string' ? value : undefined;
  }
}
