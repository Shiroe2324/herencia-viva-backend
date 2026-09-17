import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { Resend } from 'resend';

import { EmailConfig, emailConfig } from '@/configs';
import { QUEUES, TOKENS } from '@/constants';
import type { MailJobData } from '@/types';

@Processor(QUEUES.SEND_MAIL)
export class MailsProcessor extends WorkerHost {
  constructor(
    @Inject(TOKENS.RESEND) private readonly resend: Resend,
    @Inject(emailConfig.KEY) private readonly emailCfg: EmailConfig,
  ) {
    super();
  }

  public async process(job: Job<MailJobData>) {
    const data = job.data;

    await job.updateProgress(50);

    const from = data.from ?? `${this.emailCfg.fromName} <${this.emailCfg.from}>`;
    const to = data.to;
    const subject = data.subject;
    const html = data.html;

    await this.resend.emails.send({ from, to, subject, html });
    await job.updateProgress(100);
  }
}
