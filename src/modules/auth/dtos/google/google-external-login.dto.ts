import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { GOOGLE_EXTERNAL_LOGIN_DOCS } from '@/auth/docs/constants/auth-google.constant';
import { EXPIRATION_TIME_EXAMPLE, JWT_TOKEN_EXAMPLE } from '@/constants';
import { IsToken } from '@/decorators';

const { REQUEST, RESPONSE } = GOOGLE_EXTERNAL_LOGIN_DOCS;

@ApiSchema({ name: REQUEST.NAME, description: REQUEST.DESCRIPTION })
export class GoogleExternalLoginRequest {
  @ApiProperty({ description: REQUEST.FIELDS.TOKEN, example: JWT_TOKEN_EXAMPLE })
  @IsToken()
  public token!: string;
}

@ApiSchema({ name: RESPONSE.NAME, description: RESPONSE.DESCRIPTION })
export class GoogleExternalLoginResponse {
  @ApiProperty({ description: RESPONSE.FIELDS.ACCESS_TOKEN, example: JWT_TOKEN_EXAMPLE })
  public accessToken!: string;

  @ApiProperty({ description: RESPONSE.FIELDS.REFRESH_TOKEN, example: JWT_TOKEN_EXAMPLE })
  public refreshToken!: string;

  @ApiProperty({ description: RESPONSE.FIELDS.ACCESS_EXPIRES_IN, example: EXPIRATION_TIME_EXAMPLE })
  public accessExpiresIn!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.REFRESH_EXPIRES_IN, example: EXPIRATION_TIME_EXAMPLE })
  public refreshExpiresIn!: number;
}
