import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

import { AUTH_TOKEN_DOCS } from '@/constants';
import { UserEntity } from '@/database/entities/user.entity';
import { AuthTokens } from '@/enums';
import type { AuthTokenModel } from '@/models';
import { createHash, decrypt, encrypt } from '@/utils';

const { COMMENT, FIELDS } = AUTH_TOKEN_DOCS;

@Entity('auth_tokens', { comment: COMMENT })
export class AuthTokenEntity implements AuthTokenModel {
  @PrimaryGeneratedColumn('uuid', { comment: FIELDS.ID })
  public id!: string;

  @Column('varchar', { unique: true, length: 512, comment: FIELDS.CONTENT })
  public content!: string;

  @Column('varchar', { unique: true, length: 512, comment: FIELDS.HASH })
  public hash!: string;

  @Column('enum', { enum: AuthTokens, comment: FIELDS.TYPE })
  public type!: AuthTokens;

  @Column('uuid', { comment: FIELDS.SESSION_ID })
  @Index()
  public sessionId!: string;

  @Column('timestamp', { comment: FIELDS.EXPIRATION_DATE })
  public expirationDate!: Date;

  @Column('boolean', { default: false, comment: FIELDS.IS_BLACKLISTED })
  public isBlacklisted!: boolean;

  @ManyToOne(() => UserEntity, (user) => user.tokens, { onDelete: 'CASCADE' })
  public user!: Relation<UserEntity>;

  @OneToOne(() => AuthTokenEntity, (token) => token.inverseAssociatedToken, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'associated_token_id' })
  public associatedToken!: Relation<AuthTokenEntity> | null;

  @OneToOne(() => AuthTokenEntity, (token) => token.associatedToken, { nullable: true })
  public inverseAssociatedToken!: Relation<AuthTokenEntity> | null;

  @CreateDateColumn({ comment: FIELDS.CREATED_AT })
  public createdAt!: Date;

  @UpdateDateColumn({ comment: FIELDS.UPDATED_AT })
  public updatedAt!: Date;

  @DeleteDateColumn({ comment: FIELDS.DELETED_AT })
  public deletedAt!: Date | null;

  @BeforeInsert()
  @BeforeUpdate()
  async encryptAndHashContent() {
    if (!this.content) return;

    const isEncrypted = this.content.includes(':');
    const decrypted = isEncrypted ? decrypt(this.content) : this.content;

    this.hash = createHash(decrypted);
    this.content = isEncrypted ? this.content : encrypt(decrypted);
  }
}
