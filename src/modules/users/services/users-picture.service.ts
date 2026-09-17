import { InjectQueue } from '@nestjs/bullmq';
import { ForbiddenException, Injectable, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';

import { QUEUES, USERS_ERROR_CODES } from '@/constants';
import { FileOrigins, PictureQueueTypes } from '@/enums';
import { UserPictureRepositoryService } from '@/repositories/services/user-picture.service';
import { UserRepositoryService } from '@/repositories/services/user.service';
import { UsersCoreService } from '@/users/services/users-core.service';

@Injectable()
export class UsersPictureService implements OnModuleDestroy {
  constructor(
    private readonly coreService: UsersCoreService,
    private readonly userRepository: UserRepositoryService,
    private readonly userPictureRepository: UserPictureRepositoryService,
    @InjectQueue(QUEUES.UPDATE_IMAGE) private readonly updateImageQueue: Queue,
    @InjectQueue(QUEUES.DELETE_IMAGE) private readonly deleteImageQueue: Queue,
  ) {}

  public async onModuleDestroy() {
    await Promise.all([this.updateImageQueue.close(), this.deleteImageQueue.close()]);
  }

  public async updatePicture(identifier: string, pictureFile: Express.Multer.File): Promise<string | void> {
    const user = await this.coreService.getOne(identifier);
    const picture = user.picture;

    if (picture?.processing) throw new ForbiddenException(USERS_ERROR_CODES.PROFILE_PICTURE_PROCESSING);
    if (picture?.key) await this.deleteImageQueue.add('delete', { key: picture.key, type: PictureQueueTypes.USER });

    const base64Buffer = pictureFile.buffer.toString('base64');
    const { id: jobId } = await this.updateImageQueue.add('update', { base64Buffer, folder: 'user-pictures', type: PictureQueueTypes.USER });

    if (!picture) {
      const newPicture = await this.userPictureRepository.create({ jobId, processing: true, origin: FileOrigins.LOCAL });
      await this.userRepository.updatePicture(user.id, newPicture.id);
    } else {
      await this.userPictureRepository.update({ id: picture.id }, { jobId, url: null, processing: true, origin: FileOrigins.LOCAL });
    }

    return jobId;
  }

  public async deletePicture(identifier: string): Promise<string | void> {
    const user = await this.coreService.getOne(identifier);
    const picture = user.picture;

    if (!picture) throw new NotFoundException(USERS_ERROR_CODES.PROFILE_PICTURE_NOT_FOUND);
    if (picture?.processing) throw new ForbiddenException(USERS_ERROR_CODES.PROFILE_PICTURE_PROCESSING);

    if (!picture.key) {
      await this.userPictureRepository.update({ id: picture.id }, { url: null, jobId: null, processing: false });
    } else {
      const { id: jobId } = await this.deleteImageQueue.add('delete', { key: picture.key, type: PictureQueueTypes.USER });
      await this.userPictureRepository.update({ id: picture.id }, { jobId, processing: true });
      return jobId;
    }
  }
}
