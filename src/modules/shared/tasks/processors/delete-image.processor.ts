import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { QUEUES } from '@/constants';
import { TasksImagesService } from '@/tasks/services/tasks-images.service';
import type { DeleteImageJobData } from '@/types';

@Processor(QUEUES.DELETE_IMAGE)
export class DeleteImageProcessor extends WorkerHost {
  constructor(private readonly tasksImagesService: TasksImagesService) {
    super();
  }

  public async process(job: Job<DeleteImageJobData>) {
    await job.updateProgress(50);
    const result = await this.tasksImagesService.deleteImage(job.data);
    await job.updateProgress(100);
    return result;
  }

  @OnWorkerEvent('completed')
  public async onCompleted(job: Job<DeleteImageJobData>) {
    const jobId = String(job.id);
    await this.tasksImagesService.completeDeleteJob(jobId, job.data.type);
  }
}
