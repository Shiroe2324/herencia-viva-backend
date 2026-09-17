import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { USER_CLIENT_AGE_RANGE } from '@/configs';
import { AGE_EXAMPLE, GENDER_EXAMPLE, PHONE_EXAMPLE } from '@/constants';
import { IsClientAge, IsClientGender, IsClientPhoneNumber } from '@/decorators';
import { ClientGenders } from '@/enums';
import { CREATE_CLIENT_DOCS } from '@/users/docs/constants/users-clients.constant';

const { NAME, DESCRIPTION, FIELDS } = CREATE_CLIENT_DOCS.REQUEST;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class CreateClientRequest {
  @ApiProperty({ description: FIELDS.PHONE, example: PHONE_EXAMPLE, pattern: '^\\+[1-9]\\d{7,14}$' })
  @IsClientPhoneNumber()
  public phone!: string;

  @ApiProperty({ description: FIELDS.GENDER, enum: ClientGenders, example: GENDER_EXAMPLE })
  @IsClientGender()
  public gender!: ClientGenders;

  @ApiProperty({ description: FIELDS.AGE, example: AGE_EXAMPLE, ...USER_CLIENT_AGE_RANGE })
  @IsClientAge()
  public age!: number;
}
