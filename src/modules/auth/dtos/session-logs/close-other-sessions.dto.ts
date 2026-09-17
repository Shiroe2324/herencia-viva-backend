import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { CLOSE_OTHER_SESSIONS_DOCS } from '@/auth/docs/constants/auth-session-logs.constant';

const { RESPONSE } = CLOSE_OTHER_SESSIONS_DOCS;

@ApiSchema({ name: RESPONSE.NAME, description: RESPONSE.DESCRIPTION })
export class CloseOtherSessionsResponse {
  @ApiProperty({ description: RESPONSE.FIELDS.CLOSED, example: 2 })
  public closed!: number;
}
