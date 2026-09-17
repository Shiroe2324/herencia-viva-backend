import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';

import { AUTH_SESSION_LOG_DOCS } from '@/constants';
import { UserEntity } from '@/database/entities/user.entity';
import { AuthSessionLogFailureReason, AuthSessionLogStatus } from '@/enums';
import type { AuthSessionLogModel } from '@/models';

const { COMMENT, FIELDS } = AUTH_SESSION_LOG_DOCS;

@Entity('auth_session_logs', { comment: COMMENT })
export class AuthSessionLogEntity implements AuthSessionLogModel {
  @PrimaryGeneratedColumn('uuid', { comment: FIELDS.ID })
  public id!: string;

  @Column('uuid', { nullable: true, comment: FIELDS.SESSION_ID })
  @Index()
  public sessionId!: string | null;

  @Column('enum', { enum: AuthSessionLogStatus, comment: FIELDS.STATUS })
  public status!: AuthSessionLogStatus;

  @Column('enum', { enum: AuthSessionLogFailureReason, nullable: true, comment: FIELDS.FAILURE_REASON })
  public failureReason!: AuthSessionLogFailureReason | null;

  @Column('varchar', { nullable: true, length: 45, comment: FIELDS.IP_ADDRESS })
  public ipAddress!: string | null;

  @Column('text', { nullable: true, comment: FIELDS.USER_AGENT })
  public userAgent!: string | null;

  @Column('varchar', { nullable: true, length: 100, comment: FIELDS.BROWSER })
  public browser!: string | null;

  @Column('varchar', { nullable: true, length: 100, comment: FIELDS.OS })
  public os!: string | null;

  @Column('varchar', { nullable: true, length: 50, comment: FIELDS.DEVICE_TYPE })
  public deviceType!: string | null;

  @Column('varchar', { nullable: true, length: 100, comment: FIELDS.COUNTRY })
  public country!: string | null;

  @Column('varchar', { nullable: true, length: 100, comment: FIELDS.CITY })
  public city!: string | null;

  @ManyToOne(() => UserEntity, (user) => user.sessionLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: Relation<UserEntity>;

  @Column('timestamp', { nullable: true, comment: FIELDS.REVOKED_AT })
  public revokedAt!: Date | null;

  @CreateDateColumn({ comment: FIELDS.CREATED_AT })
  public createdAt!: Date;

  @UpdateDateColumn({ comment: FIELDS.UPDATED_AT })
  public updatedAt!: Date;

  @DeleteDateColumn({ comment: FIELDS.DELETED_AT })
  public deletedAt!: Date | null;
}
