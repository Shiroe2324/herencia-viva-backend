import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { USER_PROMPT_CONTEXT_LIMIT_RANGE, USER_PROMPT_LENGTH_RANGE } from '@/configs';
import {
  DATE_EXAMPLE,
  RECOMMENDATION_CHAT_ROLE_EXAMPLE,
  RECOMMENDATION_EXAMPLE,
  USER_PROMPT_EXAMPLE,
  UUID_EXAMPLE,
  VECTORING_DB_ANSWER_EXAMPLE,
  VECTORING_DB_DOCUMENT_EXAMPLE,
  VECTORING_DB_ID_EXAMPLE,
  VECTORING_DB_QUESTION_EXAMPLE,
  VECTORING_DB_TAGS_EXAMPLE,
} from '@/constants';
import { IsChatId, IsUserPrompt, IsUserPromptContextLimit } from '@/decorators';
import { LLMChatRole } from '@/enums';
import { ASK_RECOMMENDATION_DOCS } from '@/recommendations/docs/constants/recommendations-llm.constant';

const { REQUEST, RESPONSE, MESSAGE, CONTEXT } = ASK_RECOMMENDATION_DOCS;

@ApiSchema({ name: REQUEST.NAME, description: REQUEST.DESCRIPTION })
export class AskRecommendationRequest {
  @ApiProperty({ description: REQUEST.FIELDS.QUESTION, example: USER_PROMPT_EXAMPLE, ...USER_PROMPT_LENGTH_RANGE })
  @IsUserPrompt()
  public question!: string;

  @ApiPropertyOptional({ default: USER_PROMPT_CONTEXT_LIMIT_RANGE.maximum, description: REQUEST.FIELDS.LIMIT, ...USER_PROMPT_CONTEXT_LIMIT_RANGE })
  @IsUserPromptContextLimit()
  public limit: number = 5;

  @ApiPropertyOptional({ description: REQUEST.FIELDS.CHAT_ID, example: UUID_EXAMPLE, nullable: true })
  @IsChatId({ isOptional: true })
  public chatId?: string;
}

@ApiSchema({ name: CONTEXT.NAME, description: CONTEXT.DESCRIPTION })
export class RecommendationContextItem {
  @ApiProperty({ description: CONTEXT.FIELDS.ID, example: VECTORING_DB_ID_EXAMPLE })
  public id!: string;

  @ApiPropertyOptional({ description: CONTEXT.FIELDS.QUESTION, example: VECTORING_DB_QUESTION_EXAMPLE })
  public question?: string;

  @ApiPropertyOptional({ description: CONTEXT.FIELDS.ANSWER, example: VECTORING_DB_ANSWER_EXAMPLE })
  public answer?: string;

  @ApiPropertyOptional({ type: String, description: CONTEXT.FIELDS.TAGS, example: VECTORING_DB_TAGS_EXAMPLE, isArray: true, nullable: true })
  public tags?: string[] | null;

  @ApiPropertyOptional({ description: CONTEXT.FIELDS.DOCUMENT, example: VECTORING_DB_DOCUMENT_EXAMPLE })
  public document?: string;

  @ApiPropertyOptional({ description: CONTEXT.FIELDS.DISTANCE, example: 0.1423 })
  public distance?: number;
}

@ApiSchema({ name: MESSAGE.NAME, description: MESSAGE.DESCRIPTION })
export class RecommendationMessageItem {
  @ApiProperty({ enum: LLMChatRole, description: MESSAGE.FIELDS.ROLE, example: RECOMMENDATION_CHAT_ROLE_EXAMPLE })
  public role!: LLMChatRole;

  @ApiProperty({ description: MESSAGE.FIELDS.CONTENT, example: USER_PROMPT_EXAMPLE })
  public content!: string;

  @ApiProperty({ description: MESSAGE.FIELDS.CREATED_AT, example: DATE_EXAMPLE })
  public createdAt!: string;
}

@ApiSchema({ name: RESPONSE.NAME, description: RESPONSE.DESCRIPTION })
export class AskRecommendationResponse {
  @ApiProperty({ description: RESPONSE.FIELDS.CHAT_ID, example: UUID_EXAMPLE })
  public chatId!: string;

  @ApiProperty({ description: RESPONSE.FIELDS.AI_ANSWER, example: RECOMMENDATION_EXAMPLE })
  public answer!: string;

  @ApiProperty({ isArray: true, type: RecommendationContextItem, description: RESPONSE.FIELDS.CONTEXTS })
  @Type(() => RecommendationContextItem)
  public contexts!: RecommendationContextItem[];

  @ApiProperty({ isArray: true, type: RecommendationMessageItem, description: RESPONSE.FIELDS.MESSAGES })
  @Type(() => RecommendationMessageItem)
  public messages!: RecommendationMessageItem[];
}
