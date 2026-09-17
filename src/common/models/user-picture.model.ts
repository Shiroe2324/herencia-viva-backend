import { ApiHideProperty, ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { DATE_EXAMPLE, IMAGE_EXAMPLE, JOB_ID_EXAMPLE, USER_PICTURE_DOCS, UUID_EXAMPLE } from '@/constants';
import { MapUrlWithKeyFallback } from '@/decorators';
import { FileOrigins } from '@/enums';
import type { UserModel } from '@/models/user.model';
import type { ModelRef } from '@/types';

const { NAME, DESCRIPTION, FIELDS } = USER_PICTURE_DOCS;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class UserPictureModel {
  @ApiProperty({ description: FIELDS.ID, example: UUID_EXAMPLE })
  @Expose()
  public id!: string;

  @ApiHideProperty()
  @Exclude()
  public key!: string | null;

  @ApiProperty({ type: String, description: FIELDS.URL, example: IMAGE_EXAMPLE, nullable: true })
  @Expose()
  @MapUrlWithKeyFallback()
  public url!: string | null;

  @ApiProperty({ type: String, description: FIELDS.JOB_ID, example: JOB_ID_EXAMPLE, nullable: true })
  @Expose()
  public jobId!: string | null;

  @ApiProperty({ description: FIELDS.PROCESSING, example: false })
  @Expose()
  public processing!: boolean;

  @ApiProperty({ enum: FileOrigins, description: FIELDS.ORIGIN, example: FileOrigins.LOCAL })
  @Expose()
  public origin!: FileOrigins;

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

  constructor(init?: Partial<UserPictureModel>) {
    Object.assign(this, init);
  }
}
