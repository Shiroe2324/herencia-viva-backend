import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';

import { USER_CLIENT_DOCS } from '@/constants';
import { UserEntity } from '@/database/entities/user.entity';
import { ClientGenders } from '@/enums';
import type { UserClientModel } from '@/models';

const { COMMENT, FIELDS } = USER_CLIENT_DOCS;

@Entity('user_clients', { comment: COMMENT })
export class UserClientEntity implements UserClientModel {
  @PrimaryGeneratedColumn('uuid', { comment: FIELDS.ID })
  public id!: string;

  @Column('varchar', { length: 20, nullable: true, comment: FIELDS.PHONE })
  public phone!: string;

  @Column('enum', { enum: ClientGenders, nullable: true, comment: FIELDS.GENDER })
  public gender!: ClientGenders;

  @Column('int', { nullable: true, comment: FIELDS.AGE })
  public age!: number;

  @OneToOne(() => UserEntity, (user) => user.client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: Relation<UserEntity>;

  @CreateDateColumn({ comment: FIELDS.CREATED_AT })
  public createdAt!: Date;

  @UpdateDateColumn({ comment: FIELDS.UPDATED_AT })
  public updatedAt!: Date;

  @DeleteDateColumn({ comment: FIELDS.DELETED_AT })
  public deletedAt!: Date | null;
}
