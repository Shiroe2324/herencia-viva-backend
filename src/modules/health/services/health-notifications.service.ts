import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { filter, Observable, Subject, takeWhile } from 'rxjs';

import { HealthJobNotificationEventTypes } from '@/enums';
import type {
  HealthJobNotificationActiveEvent,
  HealthJobNotificationCompletedEvent,
  HealthJobNotificationErrorEvent,
  HealthJobNotificationEventType,
  HealthJobNotificationFailedEvent,
  HealthJobNotificationProgressEvent,
  HealthJobNotificationStalledEvent,
} from '@/health/dtos/notifications';

@Injectable()
export class HealthNotificationsService implements OnModuleDestroy {
  private readonly jobEvents$ = new Subject<HealthJobNotificationEventType>();

  public onModuleDestroy() {
    this.jobEvents$.complete();
  }

  public watchJob(queue: string, jobId: string): Observable<HealthJobNotificationEventType> {
    return this.jobEvents$.asObservable().pipe(
      filter((event) => event.queue === queue && event.jobId === jobId),
      takeWhile((event) => !this.isTerminalEvent(event), true),
    );
  }

  public emitActive(event: HealthJobNotificationActiveEvent) {
    this.jobEvents$.next(event);
  }

  public emitProgress(event: HealthJobNotificationProgressEvent) {
    this.jobEvents$.next(event);
  }

  public emitCompleted(event: HealthJobNotificationCompletedEvent) {
    this.jobEvents$.next(event);
  }

  public emitFailed(event: HealthJobNotificationFailedEvent) {
    this.jobEvents$.next(event);
  }

  public emitStalled(event: HealthJobNotificationStalledEvent) {
    this.jobEvents$.next(event);
  }

  public emitError(event: HealthJobNotificationErrorEvent) {
    this.jobEvents$.next(event);
  }

  private isTerminalEvent(event: HealthJobNotificationEventType) {
    return [HealthJobNotificationEventTypes.COMPLETED, HealthJobNotificationEventTypes.FAILED, HealthJobNotificationEventTypes.ERROR].includes(
      event.type,
    );
  }
}
