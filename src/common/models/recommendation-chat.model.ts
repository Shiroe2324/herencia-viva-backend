import { ApiHideProperty, ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { DATE_EXAMPLE, RECOMMENDATION_CHAT_DOCS, RECOMMENDATION_CHAT_TITLE_EXAMPLE, UUID_EXAMPLE } from '@/constants';
import { RecommendationChatMessageModel } from '@/models/recommendation-chat-message.model';
import type { UserModel } from '@/models/user.model';
import type { ModelRef, ModelRefArray } from '@/types';

const { NAME, DESCRIPTION, FIELDS } = RECOMMENDATION_CHAT_DOCS;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class RecommendationChatModel {
  @ApiProperty({ description: FIELDS.ID, example: UUID_EXAMPLE })
  @Expose()
  public id!: string;

  @ApiProperty({ description: FIELDS.TITLE, example: RECOMMENDATION_CHAT_TITLE_EXAMPLE, nullable: true })
  @Expose()
  public title!: string | null;

  @ApiProperty({ type: () => RecommendationChatMessageModel, isArray: true, description: FIELDS.MESSAGES })
  @Type(() => RecommendationChatMessageModel)
  @Expose()
  public messages!: ModelRefArray<RecommendationChatMessageModel>;

  @ApiHideProperty()
  @Exclude()
  public user!: ModelRef<UserModel>;

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

  constructor(init?: Partial<RecommendationChatModel>) {
    Object.assign(this, init);
  }
}
