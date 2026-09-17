import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';

import { USER_PICTURE_DOCS } from '@/constants';
import { UserEntity } from '@/database/entities/user.entity';
import { FileOrigins } from '@/enums';
import type { UserPictureModel } from '@/models';

const { COMMENT, FIELDS } = USER_PICTURE_DOCS;

@Entity('user_pictures', { comment: COMMENT })
export class UserPictureEntity implements UserPictureModel {
  @PrimaryGeneratedColumn('uuid', { comment: FIELDS.ID })
  public id!: string;

  @Column('text', { nullable: true, comment: FIELDS.KEY })
  public key!: string | null;

  @Column('text', { nullable: true, comment: FIELDS.URL })
  public url!: string | null;

  @Column('text', { nullable: true, comment: FIELDS.JOB_ID })
  public jobId!: string | null;

  @Column('boolean', { default: false, comment: FIELDS.PROCESSING })
  public processing!: boolean;

  @Column('enum', { enum: FileOrigins, default: FileOrigins.LOCAL, comment: FIELDS.ORIGIN })
  public origin!: FileOrigins;

  @OneToOne(() => UserEntity, (user) => user.picture, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: Relation<UserEntity>;

  @CreateDateColumn({ comment: FIELDS.CREATED_AT })
  public createdAt!: Date;

  @UpdateDateColumn({ comment: FIELDS.UPDATED_AT })
  public updatedAt!: Date;

  @DeleteDateColumn({ comment: FIELDS.DELETED_AT })
  public deletedAt!: Date | null;
}
