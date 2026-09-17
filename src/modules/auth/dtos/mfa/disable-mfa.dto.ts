import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { DISABLE_MFA_DOCS } from '@/auth/docs/constants/auth-mfa.constant';
import { USER_PASSWORD_LENGTH_RANGE } from '@/configs';
import { PASSWORD_EXAMPLE, TOTP_EXAMPLE } from '@/constants';
import { IsPassword, IsTOTPToken } from '@/decorators';

const { NAME, DESCRIPTION, FIELDS } = DISABLE_MFA_DOCS.REQUEST;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class DisableMfaRequest {
  @ApiProperty({ ...USER_PASSWORD_LENGTH_RANGE, format: 'password', description: FIELDS.PASSWORD, example: PASSWORD_EXAMPLE })
  @IsPassword()
  public password!: string;

  @ApiProperty({ description: FIELDS.TOKEN, example: TOTP_EXAMPLE })
  @IsTOTPToken()
  public token!: string;
}
