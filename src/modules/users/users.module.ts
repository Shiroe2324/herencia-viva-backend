import { Module } from '@nestjs/common';

import { FilesModule } from '@/files/files.module';
import { MailsModule } from '@/mails/mails.module';
import { RepositoriesModule } from '@/repositories/repositories.module';
import { TasksModule } from '@/tasks/tasks.module';
import { UsersClientsController } from '@/users/controllers/users-clients.controller';
import { UsersCoreController } from '@/users/controllers/users-core.controller';
import { UsersPictureController } from '@/users/controllers/users-picture.controller';
import { UsersRecoveryController } from '@/users/controllers/users-recovery.controller';
import { UsersClientsService } from '@/users/services/users-clients.service';
import { UsersCoreService } from '@/users/services/users-core.service';
import { UsersPictureService } from '@/users/services/users-picture.service';
import { UsersRecoveryService } from '@/users/services/users-recovery.service';

@Module({
  imports: [RepositoriesModule, FilesModule, MailsModule, TasksModule],
  providers: [UsersClientsService, UsersCoreService, UsersPictureService, UsersRecoveryService],
  controllers: [UsersClientsController, UsersCoreController, UsersPictureController, UsersRecoveryController],
  exports: [UsersClientsService, UsersCoreService, UsersPictureService, UsersRecoveryService],
})
export class UsersModule {}
