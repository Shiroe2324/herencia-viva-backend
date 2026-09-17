import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

import { UPDATE_PASSWORD_DOCS } from '@/auth/docs/constants/auth-password.constant';
import { USER_PASSWORD_LENGTH_RANGE } from '@/configs';
import { PASSWORD_EXAMPLE, TOTP_EXAMPLE } from '@/constants';
import { IsPassword, IsToken } from '@/decorators';

const { NAME, DESCRIPTION, FIELDS } = UPDATE_PASSWORD_DOCS.REQUEST;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class UpdatePasswordRequest {
  @ApiProperty({ ...USER_PASSWORD_LENGTH_RANGE, format: 'password', description: FIELDS.CURRENT_PASSWORD, example: PASSWORD_EXAMPLE })
  @IsPassword()
  public currentPassword!: string;

  @ApiProperty({ ...USER_PASSWORD_LENGTH_RANGE, format: 'password', description: FIELDS.NEW_PASSWORD, example: PASSWORD_EXAMPLE })
  @IsPassword()
  public newPassword!: string;

  @ApiPropertyOptional({ description: FIELDS.MFA_TOKEN, example: TOTP_EXAMPLE })
  @IsToken({ isOptional: true })
  public token?: string;
}
