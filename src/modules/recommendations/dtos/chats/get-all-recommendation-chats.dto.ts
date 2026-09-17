import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { MAX_GET_ALL_CHATS_LIMIT } from '@/configs';
import { IsGetAllChatsLimit, IsGetAllOrderBy, IsGetAllOrderDirection, IsGetAllPage } from '@/decorators';
import { GetAllOrderDirection, RecommendationChatColumns } from '@/enums';
import { RecommendationChatModel } from '@/models';
import { GET_ALL_CHATS_DOCS } from '@/recommendations/docs/constants/recommendations-chats.constant';

const { REQUEST, RESPONSE } = GET_ALL_CHATS_DOCS;

@ApiSchema({ name: REQUEST.NAME, description: REQUEST.DESCRIPTION })
export class GetAllChatsRequest {
  @ApiPropertyOptional({ enum: GetAllOrderDirection, default: GetAllOrderDirection.DESC, description: REQUEST.FIELDS.ORDER_DIRECTION })
  @IsGetAllOrderDirection()
  public orderDirection: GetAllOrderDirection = GetAllOrderDirection.DESC;

  @ApiPropertyOptional({ enum: RecommendationChatColumns, default: RecommendationChatColumns.UPDATED_AT, description: REQUEST.FIELDS.ORDER_BY })
  @IsGetAllOrderBy({ enumType: RecommendationChatColumns })
  public orderBy: RecommendationChatColumns = RecommendationChatColumns.UPDATED_AT;

  @ApiPropertyOptional({ minimum: 1, default: 1, description: REQUEST.FIELDS.PAGE })
  @IsGetAllPage()
  public page: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: MAX_GET_ALL_CHATS_LIMIT, default: 10, description: REQUEST.FIELDS.LIMIT })
  @IsGetAllChatsLimit()
  public limit: number = 10;
}

@ApiSchema({ name: RESPONSE.NAME, description: RESPONSE.DESCRIPTION })
export class GetAllChatsResponse {
  @ApiProperty({ description: RESPONSE.FIELDS.TOTAL, example: 1 })
  public total!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.PAGE, example: 1 })
  public page!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.LIMIT, example: 10 })
  public limit!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.TOTAL_PAGES, example: 1 })
  public totalPages!: number;

  @ApiProperty({ isArray: true, type: RecommendationChatModel, description: RESPONSE.FIELDS.CHATS })
  @Type(() => RecommendationChatModel)
  public chats!: RecommendationChatModel[];
}
