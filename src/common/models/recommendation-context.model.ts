import { ApiHideProperty, ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import {
  DATE_EXAMPLE,
  RECOMMENDATION_CONTEXT_DOCS,
  VECTORING_DB_ANSWER_EXAMPLE,
  VECTORING_DB_ID_EXAMPLE,
  VECTORING_DB_QUESTION_EXAMPLE,
  VECTORING_DB_TAGS_EXAMPLE,
} from '@/constants';

const { NAME, DESCRIPTION, FIELDS } = RECOMMENDATION_CONTEXT_DOCS;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class RecommendationContextModel {
  @ApiProperty({ description: FIELDS.ID, example: VECTORING_DB_ID_EXAMPLE })
  @Expose()
  public id!: string;

  @ApiProperty({ description: FIELDS.QUESTION, example: VECTORING_DB_QUESTION_EXAMPLE })
  @Expose()
  public question!: string;

  @ApiProperty({ description: FIELDS.ANSWER, example: VECTORING_DB_ANSWER_EXAMPLE })
  @Expose()
  public answer!: string;

  @ApiProperty({ type: String, description: FIELDS.TAGS, example: VECTORING_DB_TAGS_EXAMPLE, isArray: true, nullable: true })
  @Expose()
  public tags!: string[] | null;

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

  constructor(init?: Partial<RecommendationContextModel>) {
    Object.assign(this, init);
  }
}
