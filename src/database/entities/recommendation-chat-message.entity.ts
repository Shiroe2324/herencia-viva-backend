import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';

import { RECOMMENDATION_CHAT_MESSAGE_DOCS } from '@/constants';
import { RecommendationChatEntity } from '@/database/entities/recommendation-chat.entity';
import { LLMChatRole } from '@/enums';
import type { RecommendationChatMessageModel } from '@/models';

const { COMMENT, FIELDS } = RECOMMENDATION_CHAT_MESSAGE_DOCS;

@Entity('recommendation_chat_messages', { comment: COMMENT })
export class RecommendationChatMessageEntity implements RecommendationChatMessageModel {
  @PrimaryGeneratedColumn('uuid', { comment: FIELDS.ID })
  public id!: string;

  @Column('enum', { enum: LLMChatRole, comment: FIELDS.ROLE })
  public role!: LLMChatRole;

  @Column('text', { comment: FIELDS.CONTENT })
  public content!: string;

  @ManyToOne(() => RecommendationChatEntity, (chat) => chat.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  public chat!: Relation<RecommendationChatEntity>;

  @CreateDateColumn({ comment: FIELDS.CREATED_AT })
  public createdAt!: Date;

  @UpdateDateColumn({ comment: FIELDS.UPDATED_AT })
  public updatedAt!: Date;

  @DeleteDateColumn({ comment: FIELDS.DELETED_AT })
  public deletedAt!: Date | null;
}
