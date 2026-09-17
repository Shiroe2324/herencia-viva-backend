import { OnQueueEvent, QueueEventsHost, QueueEventsListener } from '@nestjs/bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { QUEUES } from '@/constants';
import { HealthJobNotificationEventTypes } from '@/enums';
import { HealthNotificationsService } from '@/health/services/health-notifications.service';
import type { OnActive, OnCompleted, OnError, OnFailed, OnProgress, OnStalled } from '@/types';

@QueueEventsListener(QUEUES.DELETE_IMAGE)
export class DeleteImageQueueEvents extends QueueEventsHost {
  constructor(
    @InjectPinoLogger(DeleteImageQueueEvents.name) private readonly logger: PinoLogger,
    private readonly healthNotificationsService: HealthNotificationsService,
  ) {
    super();
  }

  @OnQueueEvent('active')
  public onActive(args: OnActive) {
    this.logger.info({ jobId: args.jobId }, 'Image deletion job activated');
    this.healthNotificationsService.emitActive({
      type: HealthJobNotificationEventTypes.ACTIVE,
      queue: QUEUES.DELETE_IMAGE,
      jobId: args.jobId,
      prev: args.prev,
    });
  }

  @OnQueueEvent('completed')
  public onCompleted(args: OnCompleted) {
    this.logger.info({ jobId: args.jobId }, 'Image deletion job completed successfully');
    this.healthNotificationsService.emitCompleted({
      type: HealthJobNotificationEventTypes.COMPLETED,
      queue: QUEUES.DELETE_IMAGE,
      jobId: args.jobId,
      result: args.returnvalue,
    });
  }

  @OnQueueEvent('failed')
  public onFailed(args: OnFailed) {
    this.logger.error({ jobId: args.jobId, reason: args.failedReason }, 'Image deletion job failed');
    this.healthNotificationsService.emitFailed({
      type: HealthJobNotificationEventTypes.FAILED,
      queue: QUEUES.DELETE_IMAGE,
      jobId: args.jobId,
      failedReason: args.failedReason,
    });
  }

  @OnQueueEvent('progress')
  public onProgress(args: OnProgress) {
    this.logger.trace({ jobId: args.jobId, progress: args.data }, 'Image deletion job progress');
    this.healthNotificationsService.emitProgress({
      type: HealthJobNotificationEventTypes.PROGRESS,
      queue: QUEUES.DELETE_IMAGE,
      jobId: args.jobId,
      progress: args.data,
    });
  }

  @OnQueueEvent('stalled')
  public onStalled(args: OnStalled) {
    this.logger.warn({ jobId: args.jobId }, 'Image deletion job stalled');
    this.healthNotificationsService.emitStalled({
      type: HealthJobNotificationEventTypes.STALLED,
      queue: QUEUES.DELETE_IMAGE,
      jobId: args.jobId,
    });
  }

  @OnQueueEvent('error')
  public onError(args: OnError) {
    this.logger.error({ message: args.message }, 'Image deletion queue error');
    this.healthNotificationsService.emitError({
      type: HealthJobNotificationEventTypes.ERROR,
      queue: QUEUES.DELETE_IMAGE,
      message: args.message,
    });
  }
}
