import { ApiHideProperty, ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { DATE_EXAMPLE, RECOMMENDATION_CHAT_MESSAGE_DOCS, RECOMMENDATION_CHAT_ROLE_EXAMPLE, RECOMMENDATION_EXAMPLE, UUID_EXAMPLE } from '@/constants';
import { LLMChatRole } from '@/enums';
import type { RecommendationChatModel } from '@/models';
import type { ModelRef } from '@/types';

const { NAME, DESCRIPTION, FIELDS } = RECOMMENDATION_CHAT_MESSAGE_DOCS;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class RecommendationChatMessageModel {
  @ApiProperty({ description: FIELDS.ID, example: UUID_EXAMPLE })
  @Expose()
  public id!: string;

  @ApiProperty({ enum: LLMChatRole, description: FIELDS.ROLE, example: RECOMMENDATION_CHAT_ROLE_EXAMPLE })
  @Expose()
  public role!: LLMChatRole;

  @ApiProperty({ description: FIELDS.CONTENT, example: RECOMMENDATION_EXAMPLE })
  @Expose()
  public content!: string;

  @ApiHideProperty()
  @Exclude()
  public chat!: ModelRef<RecommendationChatModel>;

  @ApiProperty({ type: String, format: 'date-time', description: FIELDS.CREATED_AT, example: DATE_EXAMPLE })
  @Type(() => Date)
  @Expose()
  public createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time', description: FIELDS.UPDATED_AT, example: DATE_EXAMPLE })
  @Type(() => Date)
  @Expose()
  public updatedAt!: Date;

  @ApiHideProperty()
  @Exclude()
  public deletedAt!: Date | null;

  constructor(init?: Partial<RecommendationChatMessageModel>) {
    Object.assign(this, init);
  }
}
