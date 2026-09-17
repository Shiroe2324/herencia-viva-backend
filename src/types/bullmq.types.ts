import type { JobProgress } from 'bullmq';

import type { PictureQueueTypes } from '@/enums';

export interface UpdateImageJobData {
  type: PictureQueueTypes;
  base64Buffer: string;
  folder: string;
}

export interface UpdateImageJobResult {
  type: PictureQueueTypes;
  key: string;
}

export interface DeleteImageJobData {
  type: PictureQueueTypes;
  key: string;
}

export interface DeleteImageJobResult {
  type: PictureQueueTypes;
  deleted: boolean;
}

export interface OnActive {
  jobId: string;
  prev?: string;
}

export interface OnAdded {
  jobId: string;
  name: string;
}

export interface OnCleaned {
  count: string;
}

export interface OnCompleted {
  jobId: string;
  prev?: string;
  returnvalue: string;
}

export interface OnDebounced {
  debounceId: string;
  jobId: string;
}

export interface OnDeduplicated {
  deduplicatedJobId: string;
  deduplicationId: string;
  jobId: string;
}

export interface OnDelayed {
  delay: number;
  jobId: string;
}

export interface OnDuplicated {
  jobId: string;
}

export type OnError = Error;

export interface OnFailed {
  failedReason: string;
  jobId: string;
  prev?: string;
}

export interface OnPaused {
  [key: string]: unknown;
}

export interface OnProgress {
  data: JobProgress;
  jobId: string;
}

export interface OnRemoved {
  jobId: string;
  prev: string;
}
export interface OnResumed {
  [key: string]: unknown;
}

export interface OnRetriesExhausted {
  attemptsMade: string;
  jobId: string;
}

export interface OnStalled {
  jobId: string;
}

export interface OnWaiting {
  jobId: string;
  prev?: string;
}

export interface OnWaitingChildren {
  jobId: string;
}
