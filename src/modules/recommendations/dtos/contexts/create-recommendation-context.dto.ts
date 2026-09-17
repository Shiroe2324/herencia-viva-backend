import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

import { CONTEXT_ANSWER_LENGTH_RANGE, CONTEXT_QUESTION_LENGTH_RANGE } from '@/configs';
import { VECTORING_DB_ANSWER_EXAMPLE, VECTORING_DB_QUESTION_EXAMPLE, VECTORING_DB_TAGS_EXAMPLE } from '@/constants';
import { IsContextAnswer, IsContextQuestion, IsContextTags } from '@/decorators';
import { CREATE_RECOMMENDATION_CONTEXT_DOCS } from '@/recommendations/docs/constants/recommendations-contexts.constant';

const { REQUEST } = CREATE_RECOMMENDATION_CONTEXT_DOCS;

@ApiSchema({ name: REQUEST.NAME, description: REQUEST.DESCRIPTION })
export class CreateContextRequest {
  @ApiProperty({ description: REQUEST.FIELDS.QUESTION, example: VECTORING_DB_QUESTION_EXAMPLE, ...CONTEXT_QUESTION_LENGTH_RANGE })
  @IsContextQuestion()
  public question!: string;

  @ApiProperty({ description: REQUEST.FIELDS.ANSWER, example: VECTORING_DB_ANSWER_EXAMPLE, ...CONTEXT_ANSWER_LENGTH_RANGE })
  @IsContextAnswer()
  public answer!: string;

  @ApiPropertyOptional({ description: REQUEST.FIELDS.TAGS, example: VECTORING_DB_TAGS_EXAMPLE, isArray: true, nullable: true })
  @IsContextTags({ isOptional: true })
  public tags?: string[];
}
