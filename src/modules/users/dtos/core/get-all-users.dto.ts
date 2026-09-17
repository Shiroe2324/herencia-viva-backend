import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { MAX_GET_ALL_USERS_LIMIT } from '@/configs';
import { IsGetAllOrderBy, IsGetAllOrderDirection, IsGetAllPage, IsGetAllSelect, IsGetAllUsersLimit } from '@/decorators';
import { GetAllOrderDirection, UserColumns } from '@/enums';
import { UserModel } from '@/models';
import { GET_ALL_USERS_DOCS } from '@/users/docs/constants/users-core.constant';

const { REQUEST, RESPONSE } = GET_ALL_USERS_DOCS;
const DEFAULT_SELECT: UserColumns[] = Object.values(UserColumns);

@ApiSchema({ name: REQUEST.NAME, description: REQUEST.DESCRIPTION })
export class GetAllUsersRequest {
  @ApiPropertyOptional({ enum: GetAllOrderDirection, default: GetAllOrderDirection.ASC, description: REQUEST.FIELDS.ORDER_DIRECTION })
  @IsGetAllOrderDirection()
  public orderDirection: GetAllOrderDirection = GetAllOrderDirection.ASC;

  @ApiPropertyOptional({ enum: UserColumns, default: UserColumns.ID, description: REQUEST.FIELDS.ORDER_BY })
  @IsGetAllOrderBy({ enumType: UserColumns })
  public orderBy: UserColumns = UserColumns.ID;

  @ApiPropertyOptional({ minimum: 1, default: 1, description: REQUEST.FIELDS.PAGE })
  @IsGetAllPage()
  public page: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: MAX_GET_ALL_USERS_LIMIT, default: 10, description: REQUEST.FIELDS.LIMIT })
  @IsGetAllUsersLimit()
  public limit: number = 10;

  @ApiPropertyOptional({ isArray: true, enum: UserColumns, default: DEFAULT_SELECT, description: REQUEST.FIELDS.SELECT })
  @IsGetAllSelect({ enumType: UserColumns })
  public select: UserColumns[] = DEFAULT_SELECT;
}

@ApiSchema({ name: RESPONSE.NAME, description: RESPONSE.DESCRIPTION })
export class GetAllUsersResponse {
  @ApiProperty({ description: RESPONSE.FIELDS.TOTAL, example: 1 })
  public total!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.PAGE, example: 1 })
  public page!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.LIMIT, example: 10 })
  public limit!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.TOTAL_PAGES, example: 1 })
  public totalPages!: number;

  @ApiProperty({ type: () => UserModel, isArray: true, description: RESPONSE.FIELDS.USERS })
  @Type(() => UserModel)
  public users!: UserModel[];
}
