import type { Metadata, Where, WhereDocument } from 'chromadb';

export type ChromaInclude = 'distances' | 'documents' | 'embeddings' | 'metadatas' | 'uris';

export interface ChromaUpsertRecord {
  id: string;
  document?: string;
  metadata?: Metadata;
  embedding?: number[];
  uri?: string;
}

export interface ChromaQueryParams {
  queryTexts?: string[];
  queryEmbeddings?: number[][];
  ids?: string[];
  nResults?: number;
  where?: Where;
  whereDocument?: WhereDocument;
  include?: ChromaInclude[];
}

export interface GetDocumentArgs {
  ids?: string[];
  where?: Where;
  whereDocument?: WhereDocument;
  include?: ChromaInclude[];
  limit?: number;
  offset?: number;
}

export interface DeleteDocumentArgs {
  ids?: string[];
  where?: Where;
  whereDocument?: WhereDocument;
  limit?: number;
}
