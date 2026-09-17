import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { LOGOUT_DOCS } from '@/auth/docs/constants/auth-session.constant';
import { JWT_TOKEN_EXAMPLE } from '@/constants';
import { IsToken } from '@/decorators';

const { NAME, DESCRIPTION, FIELDS } = LOGOUT_DOCS.REQUEST;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class LogoutRequest {
  @ApiProperty({ description: FIELDS.TOKEN, example: JWT_TOKEN_EXAMPLE })
  @IsToken()
  public token!: string;
}
