import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { USER_IDENTIFIER_EXAMPLE } from '@/constants';
import { IsUserIdentifier } from '@/decorators';
import { SEND_RECOVERY_EMAIL_DOCS } from '@/users/docs/constants/users-recovery.constant';

const { NAME, DESCRIPTION, FIELDS } = SEND_RECOVERY_EMAIL_DOCS.REQUEST;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class SendRecoveryEmailRequest {
  @ApiProperty({ description: FIELDS.IDENTIFIER, example: USER_IDENTIFIER_EXAMPLE })
  @IsUserIdentifier()
  public identifier!: string;
}
