import { ApiHideProperty, ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { DATE_EXAMPLE, USER_MFA_DOCS, UUID_EXAMPLE } from '@/constants';
import type { UserModel } from '@/models/user.model';
import type { ModelRef } from '@/types';

const { NAME, DESCRIPTION, FIELDS } = USER_MFA_DOCS;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class UserMfaModel {
  @ApiProperty({ description: FIELDS.ID, example: UUID_EXAMPLE })
  @Expose()
  public id!: string;

  @ApiHideProperty()
  @Exclude()
  public secret!: string | null;

  @ApiHideProperty()
  @Exclude()
  public backupCodes!: string[] | null;

  @ApiHideProperty()
  @Exclude()
  public backupCodesGeneratedAt!: Date | null;

  @ApiProperty({ description: FIELDS.ENABLED, example: true })
  @Expose()
  public enabled!: boolean;

  @ApiHideProperty()
  @Exclude()
  public user!: ModelRef<UserModel>;

  @ApiProperty({ type: String, format: 'date-time', description: FIELDS.CREATED_AT, example: DATE_EXAMPLE })
  @Expose()
  public createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time', description: FIELDS.UPDATED_AT, example: DATE_EXAMPLE })
  @Type(() => Date)
  @Expose()
  public updatedAt!: Date;

  @ApiHideProperty()
  @Exclude()
  public deletedAt!: Date | null;

  constructor(init?: Partial<UserMfaModel>) {
    Object.assign(this, init);
  }
}
