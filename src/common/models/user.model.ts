import { ApiHideProperty, ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { USER_DISPLAY_NAME_LENGTH_RANGE, USER_USERNAME_LENGTH_RANGE } from '@/configs';
import {
  DATE_EXAMPLE,
  DISPLAY_NAME_EXAMPLE,
  EMAIL_EXAMPLE,
  USER_DOCS,
  USER_ME_USER_DOCS,
  USER_SESSION_LOGS_DOCS,
  USERNAME_EXAMPLE,
  UUID_EXAMPLE,
} from '@/constants';
import { AuthSessionLogModel } from '@/models/auth-session-log.model';
import type { AuthTokenModel } from '@/models/auth-token.model';
import type { UserClientModel } from '@/models/user-client.model';
import { UserMfaModel } from '@/models/user-mfa.model';
import { UserPictureModel } from '@/models/user-picture.model';
import { UserRoleModel } from '@/models/user-role.model';
import type { UserTokenModel } from '@/models/user-token.model';
import type { ModelRef, ModelRefArray } from '@/types';

const { NAME: USER_SESSION_LOGS_NAME, DESCRIPTION: USER_SESSION_LOGS_DESCRIPTION, FIELDS: USER_SESSION_LOGS_FIELDS } = USER_SESSION_LOGS_DOCS;
const { NAME: USER_ME_NAME, DESCRIPTION: USER_ME_DESCRIPTION, FIELDS: USER_ME_FIELDS } = USER_ME_USER_DOCS;
const { NAME, DESCRIPTION, FIELDS } = USER_DOCS;

class BaseUserModel {
  @ApiProperty({ description: FIELDS.ID, example: UUID_EXAMPLE })
  @Expose()
  public id!: string;

  @ApiHideProperty()
  @Exclude()
  public externalId!: string | null;

  @ApiProperty({ description: FIELDS.USERNAME, example: USERNAME_EXAMPLE, ...USER_USERNAME_LENGTH_RANGE })
  @Expose()
  public username!: string;

  @ApiProperty({ type: String, description: FIELDS.DISPLAY_NAME, example: DISPLAY_NAME_EXAMPLE, nullable: true, ...USER_DISPLAY_NAME_LENGTH_RANGE })
  @Expose()
  public displayName!: string | null;

  @ApiHideProperty()
  @Exclude()
  public password!: string | null;

  @ApiProperty({ description: FIELDS.IS_EMAIL_VERIFIED, example: true })
  @Expose()
  public isEmailVerified!: boolean;

  @ApiProperty({ type: () => UserRoleModel, isArray: true, description: FIELDS.ROLES })
  @Type(() => UserRoleModel)
  @Expose()
  public roles!: ModelRefArray<UserRoleModel>;

  @ApiHideProperty()
  @Exclude()
  public authTokens!: ModelRefArray<AuthTokenModel>;

  @ApiHideProperty()
  @Exclude()
  public tokens!: ModelRefArray<UserTokenModel>;

  @ApiHideProperty()
  @Exclude()
  public client!: ModelRef<UserClientModel> | null;

  @ApiProperty({ type: () => UserPictureModel, description: FIELDS.PICTURE, nullable: true })
  @Type(() => UserPictureModel)
  @Expose()
  public picture!: ModelRef<UserPictureModel> | null;

  @ApiProperty({ type: String, format: 'date-time', description: FIELDS.CREATED_AT, example: DATE_EXAMPLE })
  @Type(() => Date)
  @Expose()
  public createdAt!: Date;

  @ApiHideProperty()
  @Exclude()
  public deletedAt!: Date | null;

  constructor(init?: Partial<BaseUserModel>) {
    Object.assign(this, init);
  }
}

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class UserModel extends BaseUserModel {
  @ApiHideProperty()
  @Exclude()
  public email!: string;

  @ApiHideProperty()
  @Exclude()
  public lastLoginAt!: Date | null;

  @ApiHideProperty()
  @Exclude()
  public sessionLogs!: ModelRefArray<AuthSessionLogModel>;

  @ApiHideProperty()
  @Exclude()
  public mfa!: ModelRef<UserMfaModel> | null;

  @ApiHideProperty()
  @Exclude()
  public updatedAt!: Date;
}

@ApiSchema({ name: USER_ME_NAME, description: USER_ME_DESCRIPTION })
export class MeUserModel extends BaseUserModel {
  @ApiProperty({ description: USER_ME_FIELDS.EMAIL, example: EMAIL_EXAMPLE })
  @Expose()
  public email!: string;

  @ApiProperty({ type: String, format: 'date-time', description: USER_ME_FIELDS.LAST_LOGIN_AT, example: DATE_EXAMPLE, nullable: true })
  @Type(() => Date)
  @Expose()
  public lastLoginAt!: Date | null;

  @ApiHideProperty()
  @Exclude()
  public sessionLogs!: ModelRefArray<AuthSessionLogModel>;

  @ApiProperty({ type: () => UserMfaModel, description: USER_ME_FIELDS.MFA, nullable: true })
  @Type(() => UserMfaModel)
  @Expose()
  public mfa!: ModelRef<UserMfaModel> | null;

  @ApiProperty({ type: String, format: 'date-time', description: USER_ME_FIELDS.UPDATED_AT, example: DATE_EXAMPLE })
  @Type(() => Date)
  @Expose()
  public updatedAt!: Date;
}

@ApiSchema({ name: USER_SESSION_LOGS_NAME, description: USER_SESSION_LOGS_DESCRIPTION })
export class UserSessionLogsModel extends BaseUserModel {
  @ApiHideProperty()
  @Exclude()
  public email!: string;

  @ApiHideProperty()
  @Exclude()
  public lastLoginAt!: Date | null;

  @ApiProperty({ type: () => AuthSessionLogModel, isArray: true, description: USER_SESSION_LOGS_FIELDS.SESSION_LOGS })
  @Type(() => AuthSessionLogModel)
  @Expose()
  public sessionLogs!: AuthSessionLogModel[];

  @ApiHideProperty()
  @Exclude()
  public mfa!: ModelRef<UserMfaModel> | null;

  @ApiHideProperty()
  @Exclude()
  public updatedAt!: Date;
}
