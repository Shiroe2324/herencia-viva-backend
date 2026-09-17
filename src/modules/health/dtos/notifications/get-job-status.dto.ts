import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

import { JOB_ERROR_MESSAGE_EXAMPLE, JOB_FAILED_REASON_EXAMPLE, JOB_ID_EXAMPLE, JOB_PREV_EXAMPLE, JOB_PROGRESS_EXAMPLE, QUEUES } from '@/constants';
import { IsJobId, IsJobQueue } from '@/decorators';
import { HealthJobNotificationEventTypes } from '@/enums';
import { HEALTH_NOTIFICATIONS_DOCS } from '@/health/docs/constants/health-notifications.constant';

const { REQUEST, EVENTS } = HEALTH_NOTIFICATIONS_DOCS;

@ApiSchema({ name: REQUEST.NAME, description: REQUEST.DESCRIPTION })
export class GetJobStatusRequest {
  @ApiProperty({ description: REQUEST.FIELDS.QUEUE, enum: Object.values(QUEUES), example: QUEUES.UPDATE_IMAGE })
  @IsJobQueue()
  public queue!: (typeof QUEUES)[keyof typeof QUEUES];

  @ApiProperty({ description: REQUEST.FIELDS.JOB_ID, example: JOB_ID_EXAMPLE })
  @IsJobId()
  public jobId!: string;
}

@ApiSchema({ name: EVENTS.ACTIVE.NAME, description: EVENTS.ACTIVE.DESCRIPTION })
export class HealthJobNotificationActiveEvent {
  @ApiProperty({ description: EVENTS.ACTIVE.FIELDS.TYPE, enum: HealthJobNotificationEventTypes, default: HealthJobNotificationEventTypes.ACTIVE })
  public type!: HealthJobNotificationEventTypes;

  @ApiProperty({ description: EVENTS.ACTIVE.FIELDS.QUEUE, enum: Object.values(QUEUES), example: QUEUES.UPDATE_IMAGE })
  public queue!: string;

  @ApiProperty({ description: EVENTS.ACTIVE.FIELDS.JOB_ID, example: JOB_ID_EXAMPLE })
  public jobId!: string;

  @ApiPropertyOptional({ description: EVENTS.ACTIVE.FIELDS.PREV, example: JOB_PREV_EXAMPLE })
  public prev?: string;
}

@ApiSchema({ name: EVENTS.PROGRESS.NAME, description: EVENTS.PROGRESS.DESCRIPTION })
export class HealthJobNotificationProgressEvent {
  @ApiProperty({ description: EVENTS.PROGRESS.FIELDS.TYPE, enum: HealthJobNotificationEventTypes, default: HealthJobNotificationEventTypes.PROGRESS })
  public type!: HealthJobNotificationEventTypes;

  @ApiProperty({ description: EVENTS.PROGRESS.FIELDS.QUEUE, enum: Object.values(QUEUES), example: QUEUES.UPDATE_IMAGE })
  public queue!: string;

  @ApiProperty({ description: EVENTS.PROGRESS.FIELDS.JOB_ID, example: JOB_ID_EXAMPLE })
  public jobId!: string;

  @ApiPropertyOptional({ description: EVENTS.PROGRESS.FIELDS.PROGRESS, type: Object, example: JOB_PROGRESS_EXAMPLE })
  public progress?: unknown;
}

@ApiSchema({ name: EVENTS.COMPLETED.NAME, description: EVENTS.COMPLETED.DESCRIPTION })
export class HealthJobNotificationCompletedEvent {
  @ApiProperty({
    description: EVENTS.COMPLETED.FIELDS.TYPE,
    enum: HealthJobNotificationEventTypes,
    default: HealthJobNotificationEventTypes.COMPLETED,
  })
  public type!: HealthJobNotificationEventTypes;

  @ApiProperty({ description: EVENTS.COMPLETED.FIELDS.QUEUE, enum: Object.values(QUEUES), example: QUEUES.UPDATE_IMAGE })
  public queue!: string;

  @ApiProperty({ description: EVENTS.COMPLETED.FIELDS.JOB_ID, example: JOB_ID_EXAMPLE })
  public jobId!: string;

  @ApiPropertyOptional({ description: EVENTS.COMPLETED.FIELDS.RESULT, type: String })
  public result?: string;
}

@ApiSchema({ name: EVENTS.FAILED.NAME, description: EVENTS.FAILED.DESCRIPTION })
export class HealthJobNotificationFailedEvent {
  @ApiProperty({ description: EVENTS.FAILED.FIELDS.TYPE, enum: HealthJobNotificationEventTypes, default: HealthJobNotificationEventTypes.FAILED })
  public type!: HealthJobNotificationEventTypes;

  @ApiProperty({ description: EVENTS.FAILED.FIELDS.QUEUE, enum: Object.values(QUEUES), example: QUEUES.UPDATE_IMAGE })
  public queue!: string;

  @ApiProperty({ description: EVENTS.FAILED.FIELDS.JOB_ID, example: JOB_ID_EXAMPLE })
  public jobId!: string;

  @ApiProperty({ description: EVENTS.FAILED.FIELDS.FAILED_REASON, example: JOB_FAILED_REASON_EXAMPLE })
  public failedReason!: string;
}

@ApiSchema({ name: EVENTS.STALLED.NAME, description: EVENTS.STALLED.DESCRIPTION })
export class HealthJobNotificationStalledEvent {
  @ApiProperty({ description: EVENTS.STALLED.FIELDS.TYPE, enum: HealthJobNotificationEventTypes, default: HealthJobNotificationEventTypes.STALLED })
  public type!: HealthJobNotificationEventTypes;

  @ApiProperty({ description: EVENTS.STALLED.FIELDS.QUEUE, enum: Object.values(QUEUES), example: QUEUES.UPDATE_IMAGE })
  public queue!: string;

  @ApiProperty({ description: EVENTS.STALLED.FIELDS.JOB_ID, example: JOB_ID_EXAMPLE })
  public jobId!: string;
}

@ApiSchema({ name: EVENTS.ERROR.NAME, description: EVENTS.ERROR.DESCRIPTION })
export class HealthJobNotificationErrorEvent {
  @ApiProperty({ description: EVENTS.ERROR.FIELDS.TYPE, enum: HealthJobNotificationEventTypes, default: HealthJobNotificationEventTypes.ERROR })
  public type!: HealthJobNotificationEventTypes;

  @ApiProperty({ description: EVENTS.ERROR.FIELDS.QUEUE, enum: Object.values(QUEUES), example: QUEUES.UPDATE_IMAGE })
  public queue!: string;

  @ApiPropertyOptional({ description: EVENTS.ERROR.FIELDS.JOB_ID, example: JOB_ID_EXAMPLE })
  public jobId?: string;

  @ApiProperty({ description: EVENTS.ERROR.FIELDS.MESSAGE, example: JOB_ERROR_MESSAGE_EXAMPLE })
  public message!: string;
}

export const HealthJobNotificationEvent = {
  Active: HealthJobNotificationActiveEvent,
  Progress: HealthJobNotificationProgressEvent,
  Completed: HealthJobNotificationCompletedEvent,
  Failed: HealthJobNotificationFailedEvent,
  Stalled: HealthJobNotificationStalledEvent,
  Error: HealthJobNotificationErrorEvent,
} as const;

export type HealthJobNotificationEventType =
  | HealthJobNotificationActiveEvent
  | HealthJobNotificationProgressEvent
  | HealthJobNotificationCompletedEvent
  | HealthJobNotificationFailedEvent
  | HealthJobNotificationStalledEvent
  | HealthJobNotificationErrorEvent;
