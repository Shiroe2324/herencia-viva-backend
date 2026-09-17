import { Module } from '@nestjs/common';

import { MailsService } from '@/mails/mails.service';
import { TasksModule } from '@/tasks/tasks.module';

@Module({
  imports: [TasksModule],
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}
