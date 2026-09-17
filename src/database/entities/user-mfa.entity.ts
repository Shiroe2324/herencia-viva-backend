import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';

import { USER_MFA_DOCS } from '@/constants';
import { UserEntity } from '@/database/entities/user.entity';
import { UserMfaModel } from '@/models';

const { COMMENT, FIELDS } = USER_MFA_DOCS;

@Entity('user_mfa', { comment: COMMENT })
export class UserMfaEntity implements UserMfaModel {
  @PrimaryGeneratedColumn('uuid', { comment: FIELDS.ID })
  public id!: string;

  @Column('boolean', { default: false, comment: FIELDS.ENABLED })
  public enabled!: boolean;

  @Column('text', { nullable: true, comment: FIELDS.SECRET })
  public secret!: string | null;

  @Column('json', { nullable: true, comment: FIELDS.BACKUP_CODES })
  public backupCodes!: string[] | null;

  @Column('timestamp', { default: null, nullable: true, comment: FIELDS.BACKUP_CODES_GENERATED_AT })
  public backupCodesGeneratedAt!: Date | null;

  @OneToOne(() => UserEntity, (user) => user.mfa, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: Relation<UserEntity>;

  @CreateDateColumn({ comment: FIELDS.CREATED_AT })
  public createdAt!: Date;

  @UpdateDateColumn({ comment: FIELDS.UPDATED_AT })
  public updatedAt!: Date;

  @DeleteDateColumn({ comment: FIELDS.DELETED_AT })
  public deletedAt!: Date | null;
}
