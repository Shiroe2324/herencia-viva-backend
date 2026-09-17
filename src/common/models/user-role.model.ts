import { ApiHideProperty, ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { USER_ROLE_DOCS, UUID_EXAMPLE } from '@/constants';
import { UserRoles } from '@/enums';
import type { UserModel } from '@/models/user.model';
import type { ModelRefArray } from '@/types';

const { NAME, DESCRIPTION, FIELDS } = USER_ROLE_DOCS;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class UserRoleModel {
  @ApiProperty({ description: FIELDS.ID, example: UUID_EXAMPLE })
  @Expose()
  public id!: string;

  @ApiProperty({ enum: UserRoles, description: FIELDS.NAME, example: UserRoles.ADMIN })
  @Expose()
  public name!: UserRoles;

  @ApiHideProperty()
  @Exclude()
  public users!: ModelRefArray<UserModel>;

  @ApiHideProperty()
  @Exclude()
  public createdAt!: Date;

  @ApiHideProperty()
  @Exclude()
  public updatedAt!: Date;

  @ApiHideProperty()
  @Exclude()
  public deletedAt!: Date | null;

  constructor(init?: Partial<UserRoleModel>) {
    Object.assign(this, init);
  }
}
