import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { LOGIN_DOCS } from '@/auth/docs/constants/auth-session.constant';
import { USER_PASSWORD_LENGTH_RANGE } from '@/configs';
import { EXPIRATION_TIME_EXAMPLE, JWT_TOKEN_EXAMPLE, PASSWORD_EXAMPLE, USER_IDENTIFIER_EXAMPLE, UUID_EXAMPLE } from '@/constants';
import { IsPassword, IsUserIdentifier } from '@/decorators';

const { REQUEST, RESPONSE, MFA_REQUIRED_RESPONSE } = LOGIN_DOCS;

@ApiSchema({ name: REQUEST.NAME, description: REQUEST.DESCRIPTION })
export class LoginRequest {
  @ApiProperty({ description: REQUEST.FIELDS.IDENTIFIER, example: USER_IDENTIFIER_EXAMPLE })
  @IsUserIdentifier()
  public identifier!: string;

  @ApiProperty({ ...USER_PASSWORD_LENGTH_RANGE, format: 'password', description: REQUEST.FIELDS.PASSWORD, example: PASSWORD_EXAMPLE })
  @IsPassword()
  public password!: string;
}

@ApiSchema({ name: RESPONSE.NAME, description: RESPONSE.DESCRIPTION })
export class LoginResponse {
  @ApiProperty({ description: RESPONSE.FIELDS.ACCESS_TOKEN, example: JWT_TOKEN_EXAMPLE })
  public accessToken!: string;

  @ApiProperty({ description: RESPONSE.FIELDS.REFRESH_TOKEN, example: JWT_TOKEN_EXAMPLE })
  public refreshToken!: string;

  @ApiProperty({ description: RESPONSE.FIELDS.ACCESS_EXPIRES_IN, example: EXPIRATION_TIME_EXAMPLE })
  public accessExpiresIn!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.REFRESH_EXPIRES_IN, example: EXPIRATION_TIME_EXAMPLE })
  public refreshExpiresIn!: number;
}

@ApiSchema({ name: MFA_REQUIRED_RESPONSE.NAME, description: MFA_REQUIRED_RESPONSE.DESCRIPTION })
export class LoginMfaRequiredResponse {
  @ApiProperty({ description: MFA_REQUIRED_RESPONSE.FIELDS.MFA_REQUIRED, example: true })
  public mfaRequired!: boolean;

  @ApiProperty({ description: MFA_REQUIRED_RESPONSE.FIELDS.OTP_SESSION_ID, example: UUID_EXAMPLE })
  public otpSessionId!: string;
}
