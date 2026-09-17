import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { Collection, DeleteResult, GetResult, QueryResult } from 'chromadb';
import type { ChromaClient, CloudClient } from 'chromadb';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import type { ChromaConfig } from '@/configs';
import { chromaConfig } from '@/configs';
import { TOKENS } from '@/constants';
import type { ChromaQueryParams, ChromaUpsertRecord, DeleteDocumentArgs, GetDocumentArgs } from '@/types';

@Injectable()
export class ChromaService implements OnModuleInit {
  private collection?: Collection;
  private collectionInitPromise?: Promise<Collection>;

  constructor(
    @Inject(TOKENS.CHROMA) private readonly client: ChromaClient | CloudClient,
    @Inject(chromaConfig.KEY) private readonly chromaCfg: ChromaConfig,
    @InjectPinoLogger(ChromaService.name) private readonly logger: PinoLogger,
  ) {}

  public async onModuleInit() {
    try {
      await this.ensureCollection();
    } catch (error) {
      this.logger.warn({ error }, 'Chroma collection initialization failed. The service will retry lazily on first use.');
    }
  }

  public async upsertRecords(records: ChromaUpsertRecord[]): Promise<void> {
    if (records.length === 0) return;

    const collection = await this.ensureCollection();
    const batches = this.toBatches(records, this.chromaCfg.batchSize);

    for (const batch of batches) {
      const ids = batch.map((record) => record.id);
      const documents = this.getOptionalBatchField(batch, 'document');
      const embeddings = this.getOptionalBatchField(batch, 'embedding');
      const metadatas = this.getOptionalBatchField(batch, 'metadata');
      const uris = this.getOptionalBatchField(batch, 'uri');

      await collection.upsert({ ids, documents, embeddings, metadatas, uris });
    }

    this.logger.debug({ total: records.length, collectionName: this.collection?.name }, 'Records upserted into Chroma');
  }

  public async query(params: ChromaQueryParams): Promise<QueryResult> {
    const collection = await this.ensureCollection();

    const query = {
      queryTexts: params.queryTexts,
      queryEmbeddings: params.queryEmbeddings,
      ids: params.ids,
      nResults: params.nResults || 5,
      where: params.where,
      whereDocument: params.whereDocument,
      include: params.include || ['documents', 'metadatas', 'distances'],
    };

    return collection.query(query);
  }

  public async get(args?: GetDocumentArgs): Promise<GetResult> {
    const collection = await this.ensureCollection();
    return collection.get(args);
  }

  public async count(): Promise<number> {
    const collection = await this.ensureCollection();
    return collection.count();
  }

  public async peek(limit = 10): Promise<GetResult> {
    const collection = await this.ensureCollection();
    return collection.peek({ limit });
  }

  public async delete(args: DeleteDocumentArgs): Promise<DeleteResult> {
    const collection = await this.ensureCollection();
    return collection.delete(args);
  }

  public async deleteCollection(): Promise<void> {
    await this.client.deleteCollection({ name: this.chromaCfg.collectionName });
    this.collection = undefined;
    this.collectionInitPromise = undefined;
    this.logger.warn({ collectionName: this.chromaCfg.collectionName }, 'Chroma collection deleted');
  }

  private async ensureCollection(): Promise<Collection> {
    if (this.collection) return this.collection;
    if (this.collectionInitPromise) return this.collectionInitPromise;

    this.collectionInitPromise = this.initializeCollection();

    try {
      this.collection = await this.collectionInitPromise;
      return this.collection;
    } finally {
      this.collectionInitPromise = undefined;
    }
  }

  private async initializeCollection(): Promise<Collection> {
    await this.client.heartbeat();

    if (this.chromaCfg.resetOnStart && !this.chromaCfg.isCloud) {
      this.logger.warn({ collectionName: this.chromaCfg.collectionName }, 'CHROMA_RESET_ON_START is enabled, resetting Chroma database');
      await this.client.reset();
    }

    const collection = await this.client.getOrCreateCollection({ name: this.chromaCfg.collectionName, embeddingFunction: null });

    this.logger.info({ collectionName: collection.name }, 'Chroma collection ready');
    return collection;
  }

  private getOptionalBatchField<TField extends keyof ChromaUpsertRecord>(
    batch: ChromaUpsertRecord[],
    field: TField,
  ): Array<Exclude<ChromaUpsertRecord[TField], undefined>> | undefined {
    const hasAny = batch.some((record) => record[field] !== undefined);
    if (!hasAny) return undefined;

    const hasMissing = batch.some((record) => record[field] === undefined);
    if (hasMissing) throw new Error(`Every record must include '${String(field)}' when at least one record has it in the same batch`);

    return batch.map((record) => record[field]) as Array<Exclude<ChromaUpsertRecord[TField], undefined>>;
  }

  private toBatches<T>(items: T[], batchSize: number): T[][] {
    const chunks: T[][] = [];

    for (let index = 0; index < items.length; index += batchSize) {
      chunks.push(items.slice(index, index + batchSize));
    }

    return chunks;
  }
}
