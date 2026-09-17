import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { MAX_GET_ALL_CONTEXTS_LIMIT } from '@/configs';
import { IsGetAllContextsLimit, IsGetAllOrderBy, IsGetAllOrderDirection, IsGetAllPage } from '@/decorators';
import { GetAllOrderDirection, RecommendationContextColumns } from '@/enums';
import { RecommendationContextModel } from '@/models';
import { GET_ALL_RECOMMENDATION_CONTEXTS_DOCS } from '@/recommendations/docs/constants/recommendations-contexts.constant';

const { REQUEST, RESPONSE } = GET_ALL_RECOMMENDATION_CONTEXTS_DOCS;

@ApiSchema({ name: REQUEST.NAME, description: REQUEST.DESCRIPTION })
export class GetAllRecommendationContextsRequest {
  @ApiPropertyOptional({ enum: RecommendationContextColumns, default: RecommendationContextColumns.UPDATED_AT, description: REQUEST.FIELDS.ORDER_BY })
  @IsGetAllOrderBy({ enumType: RecommendationContextColumns })
  public orderBy: RecommendationContextColumns = RecommendationContextColumns.UPDATED_AT;

  @ApiPropertyOptional({ enum: GetAllOrderDirection, default: GetAllOrderDirection.DESC, description: REQUEST.FIELDS.ORDER_DIRECTION })
  @IsGetAllOrderDirection()
  public orderDirection: GetAllOrderDirection = GetAllOrderDirection.DESC;

  @ApiPropertyOptional({ default: 1, minimum: 1, description: REQUEST.FIELDS.PAGE })
  @IsGetAllPage()
  public page: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: MAX_GET_ALL_CONTEXTS_LIMIT, description: REQUEST.FIELDS.LIMIT })
  @IsGetAllContextsLimit()
  public limit: number = 10;
}

@ApiSchema({ name: RESPONSE.NAME, description: RESPONSE.DESCRIPTION })
export class GetAllRecommendationContextsResponse {
  @ApiProperty({ example: 100, description: RESPONSE.FIELDS.TOTAL })
  public total!: number;

  @ApiProperty({ example: 1, description: RESPONSE.FIELDS.PAGE })
  public page!: number;

  @ApiProperty({ example: 10, description: RESPONSE.FIELDS.LIMIT })
  public limit!: number;

  @ApiProperty({ example: 10, description: RESPONSE.FIELDS.TOTAL_PAGES })
  public totalPages!: number;

  @ApiProperty({ type: () => RecommendationContextModel, isArray: true, description: RESPONSE.FIELDS.CONTEXTS })
  @Type(() => RecommendationContextModel)
  public contexts!: RecommendationContextModel[];
}
