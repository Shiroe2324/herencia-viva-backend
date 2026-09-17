import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';

import { USER_ROLE_DOCS } from '@/constants';
import { UserEntity } from '@/database/entities/user.entity';
import { UserRoles } from '@/enums';
import type { UserRoleModel } from '@/models';

const { COMMENT, FIELDS } = USER_ROLE_DOCS;

@Entity('user_roles', { comment: COMMENT })
export class UserRoleEntity implements UserRoleModel {
  @PrimaryGeneratedColumn('uuid', { comment: FIELDS.ID })
  public id!: string;

  @Column('enum', { enum: UserRoles, unique: true, comment: FIELDS.NAME })
  public name!: UserRoles;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  public users!: Relation<UserEntity[]>;

  @CreateDateColumn({ comment: FIELDS.CREATED_AT })
  public createdAt!: Date;

  @UpdateDateColumn({ comment: FIELDS.UPDATED_AT })
  public updatedAt!: Date;

  @DeleteDateColumn({ comment: FIELDS.DELETED_AT })
  public deletedAt!: Date | null;
}
