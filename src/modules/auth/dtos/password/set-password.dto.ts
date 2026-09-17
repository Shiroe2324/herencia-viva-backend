import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { SET_PASSWORD_DOCS } from '@/auth/docs/constants/auth-password.constant';
import { USER_PASSWORD_LENGTH_RANGE } from '@/configs';
import { PASSWORD_EXAMPLE } from '@/constants';
import { IsPassword } from '@/decorators';

const { NAME, DESCRIPTION, FIELDS } = SET_PASSWORD_DOCS.REQUEST;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class SetPasswordRequest {
  @ApiProperty({ ...USER_PASSWORD_LENGTH_RANGE, format: 'password', description: FIELDS.NEW_PASSWORD, example: PASSWORD_EXAMPLE })
  @IsPassword()
  public newPassword!: string;
}
