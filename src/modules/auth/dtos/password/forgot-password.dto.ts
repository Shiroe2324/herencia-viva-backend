import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { FORGOT_PASSWORD_DOCS } from '@/auth/docs/constants/auth-password.constant';
import { EMAIL_EXAMPLE } from '@/constants';
import { IsUserEmail } from '@/decorators';

const { NAME, DESCRIPTION, FIELDS } = FORGOT_PASSWORD_DOCS.REQUEST;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class ForgotPasswordRequest {
  @ApiProperty({ description: FIELDS.EMAIL, example: EMAIL_EXAMPLE })
  @IsUserEmail()
  public email!: string;
}
