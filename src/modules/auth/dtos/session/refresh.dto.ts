import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { REFRESH_DOCS } from '@/auth/docs/constants/auth-session.constant';
import { EXPIRATION_TIME_EXAMPLE, JWT_TOKEN_EXAMPLE } from '@/constants';
import { IsToken } from '@/decorators';

const { REQUEST, RESPONSE } = REFRESH_DOCS;

@ApiSchema({ name: REQUEST.NAME, description: REQUEST.DESCRIPTION })
export class RefreshRequest {
  @ApiProperty({ description: REQUEST.FIELDS.TOKEN, example: JWT_TOKEN_EXAMPLE })
  @IsToken()
  public token!: string;
}

@ApiSchema({ name: RESPONSE.NAME, description: RESPONSE.DESCRIPTION })
export class RefreshTokensResponse {
  @ApiProperty({ description: RESPONSE.FIELDS.ACCESS_TOKEN, example: JWT_TOKEN_EXAMPLE })
  public accessToken!: string;

  @ApiProperty({ description: RESPONSE.FIELDS.REFRESH_TOKEN, example: JWT_TOKEN_EXAMPLE })
  public refreshToken!: string;

  @ApiProperty({ description: RESPONSE.FIELDS.ACCESS_EXPIRES_IN, example: EXPIRATION_TIME_EXAMPLE })
  public accessExpiresIn!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.REFRESH_EXPIRES_IN, example: EXPIRATION_TIME_EXAMPLE })
  public refreshExpiresIn!: number;
}
