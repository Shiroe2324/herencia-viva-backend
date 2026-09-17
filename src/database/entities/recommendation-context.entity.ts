import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { RECOMMENDATION_CONTEXT_DOCS } from '@/constants';
import type { RecommendationContextModel } from '@/models';

const { COMMENT, FIELDS } = RECOMMENDATION_CONTEXT_DOCS;

@Entity('recommendation_contexts', { comment: COMMENT })
export class RecommendationContextEntity implements RecommendationContextModel {
  @PrimaryGeneratedColumn('uuid', { comment: FIELDS.ID })
  public id!: string;

  @Column('text', { comment: FIELDS.QUESTION })
  public question!: string;

  @Column('text', { comment: FIELDS.ANSWER })
  public answer!: string;

  @Column('simple-array', { nullable: true, comment: FIELDS.TAGS })
  public tags!: string[] | null;

  @CreateDateColumn({ comment: FIELDS.CREATED_AT })
  public createdAt!: Date;

  @UpdateDateColumn({ comment: FIELDS.UPDATED_AT })
  public updatedAt!: Date;

  @DeleteDateColumn({ comment: FIELDS.DELETED_AT })
  public deletedAt!: Date | null;
}
