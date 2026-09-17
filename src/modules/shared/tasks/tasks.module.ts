import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { QUEUES } from '@/constants';
import { FilesModule } from '@/files/files.module';
import { HealthModule } from '@/health/health.module';
import { ResendProvider } from '@/providers';
import { RepositoriesModule } from '@/repositories/repositories.module';
import { DeleteImageQueueEvents } from '@/tasks/events/delete-image.event';
import { MailsQueueEvents } from '@/tasks/events/mails.event';
import { UpdateImageQueueEvents } from '@/tasks/events/update-image.event';
import { DeleteImageProcessor } from '@/tasks/processors/delete-image.processor';
import { MailsProcessor } from '@/tasks/processors/mails.processor';
import { UpdateImageProcessor } from '@/tasks/processors/update-image.processor';
import { TasksCronsService } from '@/tasks/services/tasks-crons.service';
import { TasksImagesService } from '@/tasks/services/tasks-images.service';

@Module({
  imports: [
    RepositoriesModule,
    FilesModule,
    HealthModule,
    ScheduleModule.forRoot(),
    BullModule.registerQueue({ name: QUEUES.UPDATE_IMAGE }, { name: QUEUES.DELETE_IMAGE }, { name: QUEUES.SEND_MAIL }),
  ],
  providers: [
    ResendProvider,
    TasksCronsService,
    TasksImagesService,
    MailsProcessor,
    UpdateImageProcessor,
    DeleteImageProcessor,
    MailsQueueEvents,
    UpdateImageQueueEvents,
    DeleteImageQueueEvents,
  ],
  exports: [TasksCronsService, BullModule],
})
export class TasksModule {}
