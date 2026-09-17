import { Controller, MessageEvent, Query, Sse } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';

import { HEALTH_NOTIFICATIONS_TAG } from '@/constants';
import { Private } from '@/decorators';
import { ApiHealthNotificationsDocs } from '@/health/docs/definitions/health-notification.doc';
import { GetJobStatusRequest } from '@/health/dtos/notifications';
import { HealthNotificationsService } from '@/health/services/health-notifications.service';

@ApiTags(HEALTH_NOTIFICATIONS_TAG.NAME)
@Private()
@Controller('health/notifications')
export class HealthNotificationsController {
  constructor(private readonly healthNotificationsService: HealthNotificationsService) {}

  @Sse('jobs')
  @ApiHealthNotificationsDocs()
  public getJob(@Query() query: GetJobStatusRequest): Observable<MessageEvent> {
    return this.healthNotificationsService.watchJob(query.queue, query.jobId).pipe(map((event) => ({ data: event })));
  }
}
