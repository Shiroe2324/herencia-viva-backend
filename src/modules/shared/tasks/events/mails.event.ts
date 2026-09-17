import { OnQueueEvent, QueueEventsHost, QueueEventsListener } from '@nestjs/bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { QUEUES } from '@/constants';
import { HealthJobNotificationEventTypes } from '@/enums';
import { HealthNotificationsService } from '@/health/services/health-notifications.service';
import type { OnActive, OnCompleted, OnError, OnFailed, OnProgress, OnStalled } from '@/types';

@QueueEventsListener(QUEUES.SEND_MAIL)
export class MailsQueueEvents extends QueueEventsHost {
  constructor(
    @InjectPinoLogger(MailsQueueEvents.name) private readonly logger: PinoLogger,
    private readonly healthNotificationsService: HealthNotificationsService,
  ) {
    super();
  }

  @OnQueueEvent('active')
  public onActive(args: OnActive) {
    this.logger.info({ id: args.jobId }, 'Mail job started');
    this.healthNotificationsService.emitActive({
      type: HealthJobNotificationEventTypes.ACTIVE,
      queue: QUEUES.SEND_MAIL,
      jobId: args.jobId,
      prev: args.prev,
    });
  }

  @OnQueueEvent('completed')
  public onCompleted(args: OnCompleted) {
    this.logger.info({ id: args.jobId }, 'Mail job completed');
    this.healthNotificationsService.emitCompleted({
      type: HealthJobNotificationEventTypes.COMPLETED,
      queue: QUEUES.SEND_MAIL,
      jobId: args.jobId,
      result: args.returnvalue,
    });
  }

  @OnQueueEvent('failed')
  public onFailed(args: OnFailed) {
    this.logger.error({ id: args.jobId, reason: args.failedReason }, 'Mail job failed');
    this.healthNotificationsService.emitFailed({
      type: HealthJobNotificationEventTypes.FAILED,
      queue: QUEUES.SEND_MAIL,
      jobId: args.jobId,
      failedReason: args.failedReason,
    });
  }

  @OnQueueEvent('progress')
  public onProgress(args: OnProgress) {
    this.logger.debug({ id: args.jobId, progress: args.data }, 'Mail job progress');
    this.healthNotificationsService.emitProgress({
      type: HealthJobNotificationEventTypes.PROGRESS,
      queue: QUEUES.SEND_MAIL,
      jobId: args.jobId,
      progress: args.data,
    });
  }

  @OnQueueEvent('stalled')
  public onStalled(args: OnStalled) {
    this.logger.warn({ id: args.jobId }, 'Mail job stalled');
    this.healthNotificationsService.emitStalled({
      type: HealthJobNotificationEventTypes.STALLED,
      queue: QUEUES.SEND_MAIL,
      jobId: args.jobId,
    });
  }

  @OnQueueEvent('error')
  public onError(args: OnError) {
    this.logger.error({ message: args.message }, 'Mail queue error');
    this.healthNotificationsService.emitError({
      type: HealthJobNotificationEventTypes.ERROR,
      queue: QUEUES.SEND_MAIL,
      message: args.message,
    });
  }
}
