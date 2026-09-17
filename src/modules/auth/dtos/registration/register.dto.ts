import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

import { REGISTER_DOCS } from '@/auth/docs/constants/auth-registration.constant';
import { USER_DISPLAY_NAME_LENGTH_RANGE, USER_PASSWORD_LENGTH_RANGE, USER_USERNAME_LENGTH_RANGE } from '@/configs';
import { USER_CLIENT_AGE_RANGE } from '@/configs';
import { AGE_EXAMPLE, DISPLAY_NAME_EXAMPLE, EMAIL_EXAMPLE, GENDER_EXAMPLE, PASSWORD_EXAMPLE, PHONE_EXAMPLE, USERNAME_EXAMPLE } from '@/constants';
import { IsClientAge, IsClientGender, IsClientPhoneNumber, IsDisplayName, IsPassword, IsUserEmail, IsUsername } from '@/decorators';
import { ClientGenders } from '@/enums';

const { NAME, DESCRIPTION, FIELDS } = REGISTER_DOCS.REQUEST;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class RegisterRequest {
  @ApiProperty({ description: FIELDS.EMAIL, example: EMAIL_EXAMPLE })
  @IsUserEmail()
  public email!: string;

  @ApiProperty({ ...USER_PASSWORD_LENGTH_RANGE, format: 'password', description: FIELDS.PASSWORD, example: PASSWORD_EXAMPLE })
  @IsPassword()
  public password!: string;

  @ApiPropertyOptional({ ...USER_USERNAME_LENGTH_RANGE, pattern: '^[a-z0-9]+$', description: FIELDS.USERNAME, example: USERNAME_EXAMPLE })
  @IsUsername({ isOptional: true })
  public username?: string;

  @ApiPropertyOptional({ ...USER_DISPLAY_NAME_LENGTH_RANGE, description: FIELDS.DISPLAY_NAME, example: DISPLAY_NAME_EXAMPLE })
  @IsDisplayName({ isOptional: true })
  public displayName?: string;

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
