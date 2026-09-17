import { ApiHideProperty, ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { AGE_EXAMPLE, DATE_EXAMPLE, GENDER_EXAMPLE, PHONE_EXAMPLE, USER_CLIENT_DOCS, UUID_EXAMPLE } from '@/constants';
import { ClientGenders } from '@/enums';
import type { UserModel } from '@/models/user.model';
import type { ModelRef } from '@/types';

const { NAME, DESCRIPTION, FIELDS } = USER_CLIENT_DOCS;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class UserClientModel {
  @ApiProperty({ description: FIELDS.ID, example: UUID_EXAMPLE })
  @Expose()
  public id!: string;

  @ApiProperty({ description: FIELDS.PHONE, example: PHONE_EXAMPLE, nullable: true })
  @Expose()
  public phone!: string;

  @ApiProperty({ description: FIELDS.GENDER, enum: ClientGenders, example: GENDER_EXAMPLE, nullable: true })
  @Expose()
  public gender!: ClientGenders;

  @ApiProperty({ description: FIELDS.AGE, example: AGE_EXAMPLE, minimum: 18, maximum: 120, nullable: true })
  @Expose()
  public age!: number;

  @ApiHideProperty()
  @Exclude()
  public user!: ModelRef<UserModel>;

  @ApiProperty({ type: String, format: 'date-time', description: FIELDS.CREATED_AT, example: DATE_EXAMPLE })
  @Type(() => Date)
  @Expose()
  public createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time', description: FIELDS.UPDATED_AT, example: DATE_EXAMPLE })
  @Type(() => Date)
  @Expose()
  public updatedAt!: Date;

  @ApiHideProperty()
  @Exclude()
  public deletedAt!: Date | null;

  constructor(init?: Partial<UserClientModel>) {
    Object.assign(this, init);
  }
}
