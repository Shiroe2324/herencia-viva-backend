import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { TOKEN_EXAMPLE } from '@/constants';
import { IsToken } from '@/decorators';
import { RECOVER_ACCOUNT_DOCS } from '@/users/docs/constants/users-recovery.constant';

const { NAME, DESCRIPTION, FIELDS } = RECOVER_ACCOUNT_DOCS.REQUEST;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class RecoverAccountRequest {
  @ApiProperty({ description: FIELDS.TOKEN, example: TOKEN_EXAMPLE })
  @IsToken()
  public token!: string;
}
