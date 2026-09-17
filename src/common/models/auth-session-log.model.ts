import { ApiHideProperty, ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { AUTH_SESSION_LOG_DOCS, DATE_EXAMPLE, UUID_EXAMPLE } from '@/constants';
import { AuthSessionLogFailureReason, AuthSessionLogStatus } from '@/enums';
import { UserModel } from '@/models/user.model';
import type { ModelRef } from '@/types';

const { NAME, DESCRIPTION, FIELDS } = AUTH_SESSION_LOG_DOCS;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class AuthSessionLogModel {
  @ApiProperty({ description: FIELDS.ID, example: UUID_EXAMPLE })
  @Expose()
  public id!: string;

  @ApiProperty({ type: String, description: FIELDS.SESSION_ID, example: UUID_EXAMPLE, nullable: true })
  @Expose()
  public sessionId!: string | null;

  @ApiProperty({ enum: AuthSessionLogStatus, description: FIELDS.STATUS, example: AuthSessionLogStatus.SUCCESS })
  @Expose()
  public status!: AuthSessionLogStatus;

  @ApiProperty({ enum: AuthSessionLogFailureReason, description: FIELDS.FAILURE_REASON, nullable: true })
  @Expose()
  public failureReason!: AuthSessionLogFailureReason | null;

  @ApiProperty({ type: String, description: FIELDS.IP_ADDRESS, example: '190.85.12.4', nullable: true })
  @Expose()
  public ipAddress!: string | null;

  @ApiHideProperty()
  @Exclude()
  public userAgent!: string | null;

  @ApiProperty({ type: String, description: FIELDS.BROWSER, example: 'Chrome', nullable: true })
  @Expose()
  public browser!: string | null;

  @ApiProperty({ type: String, description: FIELDS.OS, example: 'Windows', nullable: true })
  @Expose()
  public os!: string | null;

  @ApiProperty({ type: String, description: FIELDS.DEVICE_TYPE, example: 'desktop', nullable: true })
  @Expose()
  public deviceType!: string | null;

  @ApiProperty({ type: String, description: FIELDS.COUNTRY, example: 'Colombia', nullable: true })
  @Expose()
  public country!: string | null;

  @ApiProperty({ type: String, description: FIELDS.CITY, example: 'Bogota', nullable: true })
  @Expose()
  public city!: string | null;

  @ApiProperty({ type: () => UserModel, description: FIELDS.USER })
  @Type(() => UserModel)
  @Expose()
  public user!: ModelRef<UserModel>;

  @ApiProperty({ type: String, format: 'date-time', description: FIELDS.REVOKED_AT, example: DATE_EXAMPLE, nullable: true })
  @Type(() => Date)
  @Expose()
  public revokedAt!: Date | null;

  @ApiProperty({ type: String, format: 'date-time', description: FIELDS.CREATED_AT, example: DATE_EXAMPLE })
  @Type(() => Date)
  @Expose()
  public createdAt!: Date;

  @ApiHideProperty()
  @Exclude()
  public updatedAt!: Date;

  @ApiHideProperty()
  @Exclude()
  public deletedAt!: Date | null;

  constructor(init?: Partial<AuthSessionLogModel>) {
    Object.assign(this, init);
  }
}
