import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

import { CHAT_TITLE_LENGTH_RANGE } from '@/configs';
import { RECOMMENDATION_CHAT_DOCS } from '@/constants';
import { RecommendationChatMessageEntity } from '@/database/entities/recommendation-chat-message.entity';
import { UserEntity } from '@/database/entities/user.entity';
import type { RecommendationChatModel } from '@/models';

const { maxLength: maxRecommendationChatTitleLength } = CHAT_TITLE_LENGTH_RANGE;
const { COMMENT, FIELDS } = RECOMMENDATION_CHAT_DOCS;

@Entity('recommendation_chats', { comment: COMMENT })
export class RecommendationChatEntity implements RecommendationChatModel {
  @PrimaryGeneratedColumn('uuid', { comment: FIELDS.ID })
  public id!: string;

  @Column('varchar', { length: maxRecommendationChatTitleLength, nullable: true, comment: FIELDS.TITLE })
  public title!: string | null;

  @OneToMany(() => RecommendationChatMessageEntity, (message) => message.chat)
  public messages!: Relation<RecommendationChatMessageEntity[]>;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: Relation<UserEntity>;

  @CreateDateColumn({ comment: FIELDS.CREATED_AT })
  public createdAt!: Date;

  @UpdateDateColumn({ comment: FIELDS.UPDATED_AT })
  public updatedAt!: Date;

  @DeleteDateColumn({ comment: FIELDS.DELETED_AT })
  public deletedAt!: Date | null;
}
