import { Injectable } from '@nestjs/common';

import { PictureQueueTypes } from '@/enums';
import { FilesService } from '@/files/files.service';
import { UserPictureRepositoryService } from '@/repositories/services/user-picture.service';
import type { DeleteImageJobData, DeleteImageJobResult, UpdateImageJobData, UpdateImageJobResult } from '@/types';

@Injectable()
export class TasksImagesService {
  constructor(
    private readonly filesService: FilesService,
    private readonly userPictureRepository: UserPictureRepositoryService,
  ) {}

  public async updateImage(data: UpdateImageJobData): Promise<UpdateImageJobResult> {
    const { base64Buffer, folder, type } = data;
    const buffer = Buffer.from(base64Buffer, 'base64');
    const { key } = await this.filesService.uploadFile(buffer, folder);
    return { key, type };
  }

  public async deleteImage(data: DeleteImageJobData): Promise<DeleteImageJobResult> {
    const { key, type } = data;
    const deleted = await this.filesService.deleteFile(key);
    return { deleted, type };
  }

  public async completeUpdateJob(jobId: string, type: PictureQueueTypes, key: string): Promise<void> {
    switch (type) {
      case PictureQueueTypes.USER:
        await this.userPictureRepository.update({ jobId }, { key, processing: false });
        return;
    }
  }

  public async failUpdateJob(jobId: string, type: PictureQueueTypes): Promise<void> {
    switch (type) {
      case PictureQueueTypes.USER:
        await this.userPictureRepository.update({ jobId }, { key: null, jobId: null, processing: false });
        return;
    }
  }

  public async completeDeleteJob(jobId: string, type: PictureQueueTypes): Promise<void> {
    switch (type) {
      case PictureQueueTypes.USER:
        await this.userPictureRepository.update({ jobId }, { key: null, jobId: null, processing: false });
        return;
    }
  }
}
