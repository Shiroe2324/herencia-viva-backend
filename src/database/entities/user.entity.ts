import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { USER_DISPLAY_NAME_LENGTH_RANGE, USER_USERNAME_LENGTH_RANGE } from '@/configs';
import { USER_DOCS } from '@/constants';
import { AuthSessionLogEntity } from '@/database/entities/auth-session-log.entity';
import { AuthTokenEntity } from '@/database/entities/auth-token.entity';
import { UserClientEntity } from '@/database/entities/user-client.entity';
import { UserMfaEntity } from '@/database/entities/user-mfa.entity';
import { UserPictureEntity } from '@/database/entities/user-picture.entity';
import { UserRoleEntity } from '@/database/entities/user-role.entity';
import { UserTokenEntity } from '@/database/entities/user-token.entity';
import type { UserModel } from '@/models';

const { maxLength: maxDisplayNameLength } = USER_DISPLAY_NAME_LENGTH_RANGE;
const { maxLength: maxUsernameLength } = USER_USERNAME_LENGTH_RANGE;

const { COMMENT, FIELDS } = USER_DOCS;

@Entity('users', { comment: COMMENT })
export class UserEntity implements UserModel {
  @PrimaryGeneratedColumn('uuid', { comment: FIELDS.ID })
  public id!: string;

  @Column('varchar', { unique: true, nullable: true, comment: FIELDS.EXTERNAL_ID })
  public externalId!: string | null;

  @Column('varchar', { unique: true, length: maxUsernameLength, comment: FIELDS.USERNAME })
  public username!: string;

  @Column('varchar', { nullable: true, length: maxDisplayNameLength, comment: FIELDS.DISPLAY_NAME })
  public displayName!: string | null;

  @Column('varchar', { unique: true, length: 255, comment: FIELDS.EMAIL })
  public email!: string;

  @Column('text', { nullable: true, comment: FIELDS.PASSWORD })
  public password!: string | null;

  @Column('boolean', { default: false, comment: FIELDS.IS_EMAIL_VERIFIED })
  public isEmailVerified!: boolean;

  @Column('timestamp', { default: null, nullable: true, comment: FIELDS.LAST_LOGIN_AT })
  public lastLoginAt!: Date | null;

  @ManyToMany(() => UserRoleEntity, (role) => role.users, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'user_roles_mapping' })
  public roles!: Relation<UserRoleEntity[]>;

  @OneToMany(() => AuthTokenEntity, (token) => token.user)
  public authTokens!: Relation<AuthTokenEntity[]>;

  @OneToMany(() => AuthSessionLogEntity, (sessionLog) => sessionLog.user)
  public sessionLogs!: Relation<AuthSessionLogEntity[]>;

  @OneToMany(() => UserTokenEntity, (token) => token.user)
  public tokens!: Relation<UserTokenEntity[]>;

  @OneToOne(() => UserClientEntity, (client) => client.user, { nullable: true, cascade: true })
  public client!: Relation<UserClientEntity> | null;

  @OneToOne(() => UserMfaEntity, (mfa) => mfa.user, { nullable: true, cascade: true })
  public mfa!: Relation<UserMfaEntity> | null;

  @OneToOne(() => UserPictureEntity, (picture) => picture.user, { nullable: true, cascade: true })
  public picture!: Relation<UserPictureEntity> | null;

  @CreateDateColumn({ comment: FIELDS.CREATED_AT })
  public createdAt!: Date;

  @UpdateDateColumn({ comment: FIELDS.UPDATED_AT })
  public updatedAt!: Date;

  @DeleteDateColumn({ comment: FIELDS.DELETED_AT })
  public deletedAt!: Date | null;

  @BeforeInsert()
  public generateUsername() {
    this.username = this.username ? this.username.toLowerCase() : `user${uuidv4().slice(0, 8)}`;
  }

  @BeforeUpdate()
  public parseUsername() {
    this.username = this.username ? this.username.toLowerCase() : this.username;
  }
}
