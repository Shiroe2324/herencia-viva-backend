import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { ENABLE_MFA_DOCS } from '@/auth/docs/constants/auth-mfa.constant';
import { USER_PASSWORD_LENGTH_RANGE } from '@/configs';
import { BACKUP_CODES_EXAMPLE, BASE32_EXAMPLE, PASSWORD_EXAMPLE, TOTP_EXAMPLE } from '@/constants';
import { IsBase32Secret, IsPassword, IsTOTPToken } from '@/decorators';

const { REQUEST, RESPONSE } = ENABLE_MFA_DOCS;

@ApiSchema({ name: REQUEST.NAME, description: REQUEST.DESCRIPTION })
export class EnableMfaRequest {
  @ApiProperty({ ...USER_PASSWORD_LENGTH_RANGE, format: 'password', description: REQUEST.FIELDS.PASSWORD, example: PASSWORD_EXAMPLE })
  @IsPassword()
  public password!: string;

  @ApiProperty({ description: REQUEST.FIELDS.TOKEN, example: TOTP_EXAMPLE })
  @IsTOTPToken()
  public token!: string;

  @ApiProperty({ description: REQUEST.FIELDS.BASE32, example: BASE32_EXAMPLE })
  @IsBase32Secret()
  public base32!: string;
}

@ApiSchema({ name: RESPONSE.NAME, description: RESPONSE.DESCRIPTION })
export class EnableMfaResponse {
  @ApiProperty({ description: RESPONSE.FIELDS.BACKUP_CODES, example: BACKUP_CODES_EXAMPLE })
  public backupCodes!: string[];
}
