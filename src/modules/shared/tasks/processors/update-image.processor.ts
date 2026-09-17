import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { QUEUES } from '@/constants';
import { TasksImagesService } from '@/tasks/services/tasks-images.service';
import type { UpdateImageJobData, UpdateImageJobResult } from '@/types';

@Processor(QUEUES.UPDATE_IMAGE)
export class UpdateImageProcessor extends WorkerHost {
  constructor(private readonly tasksImagesService: TasksImagesService) {
    super();
  }

  public async process(job: Job<UpdateImageJobData>) {
    await job.updateProgress(50);
    const result = await this.tasksImagesService.updateImage(job.data);
    await job.updateProgress(100);
    return result;
  }

  @OnWorkerEvent('completed')
  public async onCompleted(job: Job<UpdateImageJobData, UpdateImageJobResult>) {
    const jobId = String(job.id);
    await this.tasksImagesService.completeUpdateJob(jobId, job.data.type, job.returnvalue.key);
  }

  @OnWorkerEvent('failed')
  public async onFailed(job: Job<UpdateImageJobData>, _error: Error) {
    const jobId = String(job.id);
    await this.tasksImagesService.failUpdateJob(jobId, job.data.type);
  }
}
