import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { RECOMMENDATION_ERROR, RECOMMENDATION_EXAMPLE, USER_PROMPT_EXAMPLE, UUID_EXAMPLE } from '@/constants';
import { AskRecommendationStreamEvents } from '@/enums';
import { ASK_RECOMMENDATION_STREAM_DOCS } from '@/recommendations/docs/constants/recommendations-llm.constant';
import { RecommendationContextItem } from '@/recommendations/dtos/llm/ask-recommendation.dto';

const { METADATA_EVENT, CONTENT_EVENT, DONE_EVENT, ERROR_EVENT } = ASK_RECOMMENDATION_STREAM_DOCS;

@ApiSchema({ name: METADATA_EVENT.NAME, description: METADATA_EVENT.DESCRIPTION })
export class AskRecommendationStreamMetadataEvent {
  @ApiProperty({ enum: AskRecommendationStreamEvents, description: METADATA_EVENT.FIELDS.TYPE, default: AskRecommendationStreamEvents.METADATA })
  public type!: AskRecommendationStreamEvents;

  @ApiProperty({ description: METADATA_EVENT.FIELDS.CHAT_ID, example: UUID_EXAMPLE })
  public chatId!: string;

  @ApiProperty({ description: METADATA_EVENT.FIELDS.QUERY, example: USER_PROMPT_EXAMPLE })
  public question!: string;

  @ApiProperty({ isArray: true, type: RecommendationContextItem, description: METADATA_EVENT.FIELDS.METADATA })
  @Type(() => RecommendationContextItem)
  public context!: RecommendationContextItem[];
}

@ApiSchema({ name: CONTENT_EVENT.NAME, description: CONTENT_EVENT.DESCRIPTION })
export class AskRecommendationStreamContentEvent {
  @ApiProperty({ enum: AskRecommendationStreamEvents, description: CONTENT_EVENT.FIELDS.TYPE, default: AskRecommendationStreamEvents.CONTENT })
  public type!: AskRecommendationStreamEvents;

  @ApiProperty({ description: CONTENT_EVENT.FIELDS.CHUNK, example: RECOMMENDATION_EXAMPLE })
  public chunk!: string;
}

@ApiSchema({ name: DONE_EVENT.NAME, description: DONE_EVENT.DESCRIPTION })
export class AskRecommendationStreamDoneEvent {
  @ApiProperty({ enum: AskRecommendationStreamEvents, description: DONE_EVENT.FIELDS.TYPE, default: AskRecommendationStreamEvents.DONE })
  public type!: AskRecommendationStreamEvents;

  @ApiProperty({ description: DONE_EVENT.FIELDS.CHAT_ID, example: UUID_EXAMPLE })
  public chatId!: string;
}

@ApiSchema({ name: ERROR_EVENT.NAME, description: ERROR_EVENT.DESCRIPTION })
export class AskRecommendationStreamErrorEvent {
  @ApiProperty({ enum: AskRecommendationStreamEvents, description: ERROR_EVENT.FIELDS.TYPE, default: AskRecommendationStreamEvents.ERROR })
  public type!: AskRecommendationStreamEvents;

  @ApiProperty({ description: ERROR_EVENT.FIELDS.ERROR, example: RECOMMENDATION_ERROR })
  public error!: string;
}

export const AskRecommendationStreamEvent = {
  Metadata: AskRecommendationStreamMetadataEvent,
  Content: AskRecommendationStreamContentEvent,
  Done: AskRecommendationStreamDoneEvent,
  Error: AskRecommendationStreamErrorEvent,
} as const;

export type AskRecommendationStreamEventType =
  | AskRecommendationStreamMetadataEvent
  | AskRecommendationStreamContentEvent
  | AskRecommendationStreamErrorEvent
  | AskRecommendationStreamDoneEvent;
