import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

import { USER_DISPLAY_NAME_LENGTH_RANGE, USER_USERNAME_LENGTH_RANGE } from '@/configs';
import { DISPLAY_NAME_EXAMPLE, USERNAME_EXAMPLE } from '@/constants';
import { IsDisplayName, IsUsername } from '@/decorators';
import { PATCH_USER_DOCS } from '@/users/docs/constants/users-core.constant';

const { NAME, DESCRIPTION, FIELDS } = PATCH_USER_DOCS.REQUEST;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class PatchUserRequest {
  @ApiPropertyOptional({ ...USER_USERNAME_LENGTH_RANGE, pattern: '^[a-z0-9]+$', description: FIELDS.USERNAME, example: USERNAME_EXAMPLE })
  @IsUsername({ isOptional: true })
  public username?: string;

  @ApiPropertyOptional({ ...USER_DISPLAY_NAME_LENGTH_RANGE, description: FIELDS.DISPLAY_NAME, example: DISPLAY_NAME_EXAMPLE })
  @IsDisplayName({ isOptional: true })
  public displayName?: string;
}
