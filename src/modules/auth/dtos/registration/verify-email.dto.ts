import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { VERIFY_EMAIL_DOCS } from '@/auth/docs/constants/auth-registration.constant';
import { TOKEN_EXAMPLE } from '@/constants';
import { IsToken } from '@/decorators';

const { NAME, DESCRIPTION, FIELDS } = VERIFY_EMAIL_DOCS.REQUEST;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class VerifyEmailRequest {
  @ApiProperty({ description: FIELDS.TOKEN, example: TOKEN_EXAMPLE })
  @IsToken()
  public token!: string;
}
