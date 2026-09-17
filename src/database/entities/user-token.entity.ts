import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

import { USER_TOKEN_DOCS } from '@/constants';
import { UserEntity } from '@/database/entities/user.entity';
import { UserTokens } from '@/enums';
import type { UserTokenModel } from '@/models';
import { createHash, decrypt, encrypt } from '@/utils';

const { COMMENT, FIELDS } = USER_TOKEN_DOCS;

@Entity('user_tokens', { comment: COMMENT })
export class UserTokenEntity implements UserTokenModel {
  @PrimaryGeneratedColumn('uuid', { comment: FIELDS.ID })
  public id!: string;

  @Column('varchar', { unique: true, length: 512, comment: FIELDS.CONTENT })
  public content!: string;

  @Column('varchar', { unique: true, length: 512, comment: FIELDS.HASH })
  public hash!: string;

  @Column('enum', { enum: UserTokens, comment: FIELDS.TYPE })
  public type!: UserTokens;

  @Column('timestamp', { comment: FIELDS.EXPIRATION_DATE })
  public expirationDate!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: Relation<UserEntity>;

  @CreateDateColumn({ comment: FIELDS.CREATED_AT })
  public createdAt!: Date;

  @UpdateDateColumn({ comment: FIELDS.UPDATED_AT })
  public updatedAt!: Date;

  @DeleteDateColumn({ comment: FIELDS.DELETED_AT })
  public deletedAt!: Date | null;

  @BeforeInsert()
  @BeforeUpdate()
  async encryptAndHashContent() {
    if (this.content && !this.content.includes(':')) {
      this.hash = createHash(this.content);
      this.content = encrypt(this.content);
    }

    if (this.content && !this.hash) {
      const decrypted = decrypt(this.content);
      this.hash = createHash(decrypted);
    }
  }
}
