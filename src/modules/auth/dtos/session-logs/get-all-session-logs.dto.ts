import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { GET_ALL_SESSION_LOGS_DOCS } from '@/auth/docs/constants/auth-session-logs.constant';
import { IsGetAllOrderBy, IsGetAllOrderDirection, IsGetAllPage, IsGetAllSelect, IsGetAllSessionLogsLimit } from '@/decorators';
import { AuthSessionLogColumns, GetAllOrderDirection } from '@/enums';
import { AuthSessionLogModel } from '@/models';

const { REQUEST, RESPONSE } = GET_ALL_SESSION_LOGS_DOCS;
const DEFAULT_SELECT: AuthSessionLogColumns[] = Object.values(AuthSessionLogColumns);

@ApiSchema({ name: REQUEST.NAME, description: REQUEST.DESCRIPTION })
export class GetAllSessionLogsRequest {
  @ApiPropertyOptional({ enum: GetAllOrderDirection, default: GetAllOrderDirection.DESC, description: REQUEST.FIELDS.ORDER_DIRECTION })
  @IsGetAllOrderDirection()
  public orderDirection: GetAllOrderDirection = GetAllOrderDirection.DESC;

  @ApiPropertyOptional({ enum: AuthSessionLogColumns, default: AuthSessionLogColumns.CREATED_AT, description: REQUEST.FIELDS.ORDER_BY })
  @IsGetAllOrderBy({ enumType: AuthSessionLogColumns })
  public orderBy: AuthSessionLogColumns = AuthSessionLogColumns.CREATED_AT;

  @ApiPropertyOptional({ minimum: 1, default: 1, description: REQUEST.FIELDS.PAGE })
  @IsGetAllPage()
  public page: number = 1;

  @ApiPropertyOptional({ minimum: 1, default: 10, description: REQUEST.FIELDS.LIMIT })
  @IsGetAllSessionLogsLimit()
  public limit: number = 10;

  @ApiPropertyOptional({ isArray: true, enum: AuthSessionLogColumns, default: DEFAULT_SELECT, description: REQUEST.FIELDS.SELECT })
  @IsGetAllSelect({ enumType: AuthSessionLogColumns })
  public select: AuthSessionLogColumns[] = DEFAULT_SELECT;
}

@ApiSchema({ name: RESPONSE.NAME, description: RESPONSE.DESCRIPTION })
export class GetAllSessionLogsResponse {
  @ApiProperty({ description: RESPONSE.FIELDS.TOTAL, example: 1 })
  public total!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.PAGE, example: 1 })
  public page!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.LIMIT, example: 10 })
  public limit!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.TOTAL_PAGES, example: 1 })
  public totalPages!: number;

  @ApiProperty({ type: () => AuthSessionLogModel, isArray: true, description: RESPONSE.FIELDS.SESSION_LOGS })
  @Type(() => AuthSessionLogModel)
  public sessionLogs!: AuthSessionLogModel[];
}
