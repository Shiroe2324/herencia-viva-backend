import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { VALIDATE_MFA_LOGIN_DOCS } from '@/auth/docs/constants/auth-mfa.constant';
import { EXPIRATION_TIME_EXAMPLE, JWT_TOKEN_EXAMPLE, TOTP_EXAMPLE, UUID_EXAMPLE } from '@/constants';
import { IsOtpSessionId, IsToken } from '@/decorators';
import { MfaTypes } from '@/enums';

const { REQUEST, RESPONSE } = VALIDATE_MFA_LOGIN_DOCS;

@ApiSchema({ name: REQUEST.NAME, description: REQUEST.DESCRIPTION })
export class ValidateMfaLoginRequest {
  @ApiProperty({ description: REQUEST.FIELDS.OTP_SESSION_ID, example: UUID_EXAMPLE })
  @IsOtpSessionId()
  public otpSessionId!: string;

  @ApiProperty({ description: REQUEST.FIELDS.TOKEN, example: TOTP_EXAMPLE })
  @IsToken()
  public token!: string;
}

@ApiSchema({ name: RESPONSE.NAME, description: RESPONSE.DESCRIPTION })
export class ValidateMfaLoginResponse {
  @ApiProperty({ description: RESPONSE.FIELDS.ACCESS_TOKEN, example: JWT_TOKEN_EXAMPLE })
  public accessToken!: string;

  @ApiProperty({ description: RESPONSE.FIELDS.REFRESH_TOKEN, example: JWT_TOKEN_EXAMPLE })
  public refreshToken!: string;

  @ApiProperty({ description: RESPONSE.FIELDS.ACCESS_EXPIRES_IN, example: EXPIRATION_TIME_EXAMPLE })
  public accessExpiresIn!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.REFRESH_EXPIRES_IN, example: EXPIRATION_TIME_EXAMPLE })
  public refreshExpiresIn!: number;

  @ApiProperty({ description: RESPONSE.FIELDS.TYPE, enum: MfaTypes, example: MfaTypes.TOTP })
  public type!: MfaTypes;
}
