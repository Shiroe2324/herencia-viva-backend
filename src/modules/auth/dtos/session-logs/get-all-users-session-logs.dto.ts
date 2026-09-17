import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { GET_ALL_USERS_SESSION_LOGS_DOCS } from '@/auth/docs/constants/auth-session-logs.constant';
import { MAX_GET_ALL_USERS_LIMIT } from '@/configs';
import { IsGetAllOrderBy, IsGetAllOrderDirection, IsGetAllPage, IsGetAllSelect, IsGetAllUsersLimit } from '@/decorators';
import { GetAllOrderDirection, UserSessionLogsColumns } from '@/enums';
import { UserSessionLogsModel } from '@/models';

const { REQUEST, RESPONSE } = GET_ALL_USERS_SESSION_LOGS_DOCS;
const DEFAULT_SELECT: UserSessionLogsColumns[] = Object.values(UserSessionLogsColumns);

@ApiSchema({ name: REQUEST.NAME, description: REQUEST.DESCRIPTION })
export class GetAllUsersSessionLogsRequest {
  @ApiPropertyOptional({ enum: GetAllOrderDirection, default: GetAllOrderDirection.ASC, description: REQUEST.FIELDS.ORDER_DIRECTION })
  @IsGetAllOrderDirection()
  public orderDirection: GetAllOrderDirection = GetAllOrderDirection.ASC;

  @ApiPropertyOptional({ enum: UserSessionLogsColumns, default: UserSessionLogsColumns.ID, description: REQUEST.FIELDS.ORDER_BY })
  @IsGetAllOrderBy({ enumType: UserSessionLogsColumns })
  public orderBy: UserSessionLogsColumns = UserSessionLogsColumns.ID;

  @ApiPropertyOptional({ minimum: 1, default: 1, description: REQUEST.FIELDS.PAGE })
  @IsGetAllPage()
  public page: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: MAX_GET_ALL_USERS_LIMIT, default: 10, description: REQUEST.FIELDS.LIMIT })
  @IsGetAllUsersLimit()
  public limit: number = 10;

  @ApiPropertyOptional({ isArray: true, enum: UserSessionLogsColumns, default: DEFAULT_SELECT, description: REQUEST.FIELDS.SELECT })
  @IsGetAllSelect({ enumType: UserSessionLogsColumns })
  public select: UserSessionLogsColumns[] = DEFAULT_SELECT;
}

@ApiSchema({ name: RESPONSE.NAME, description: RESPONSE.DESCRIPTION })
export class GetAllUsersSessionLogsResponse {
  @ApiProperty({ description: RESPONSE.FIELDS.TOTAL, example: 1 })
  public total!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.PAGE, example: 1 })
  public page!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.LIMIT, example: 10 })
  public limit!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.TOTAL_PAGES, example: 1 })
  public totalPages!: number;

  @ApiProperty({ type: () => UserSessionLogsModel, isArray: true, description: RESPONSE.FIELDS.USERS })
  @Type(() => UserSessionLogsModel)
  public users!: UserSessionLogsModel[];
}
