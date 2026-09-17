import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

import { USER_CLIENT_AGE_RANGE } from '@/configs';
import { AGE_EXAMPLE, GENDER_EXAMPLE, PHONE_EXAMPLE } from '@/constants';
import { IsClientAge, IsClientGender, IsClientPhoneNumber } from '@/decorators';
import { ClientGenders } from '@/enums';
import { PATCH_CLIENT_DOCS } from '@/users/docs/constants/users-clients.constant';

const { NAME, DESCRIPTION, FIELDS } = PATCH_CLIENT_DOCS.REQUEST;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class PatchClientRequest {
  @ApiPropertyOptional({ description: FIELDS.PHONE, example: PHONE_EXAMPLE, pattern: '^\\+[1-9]\\d{7,14}$' })
  @IsClientPhoneNumber({ isOptional: true })
  public phone?: string;

  @ApiPropertyOptional({ description: FIELDS.GENDER, enum: ClientGenders, example: GENDER_EXAMPLE })
  @IsClientGender({ isOptional: true })
  public gender?: ClientGenders;

  @ApiPropertyOptional({ description: FIELDS.AGE, example: AGE_EXAMPLE, ...USER_CLIENT_AGE_RANGE })
  @IsClientAge({ isOptional: true })
  public age?: number;
}
