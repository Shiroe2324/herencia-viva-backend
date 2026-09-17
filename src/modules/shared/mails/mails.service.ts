import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, InternalServerErrorException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { promises as fs } from 'fs';
import * as Handlebars from 'handlebars';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { join } from 'path';

import { EmailConfig, emailConfig, MainConfig, mainConfig } from '@/configs';
import { QUEUES } from '@/constants';
import { EmailTypes } from '@/enums';
import type { I18nTranslations } from '@/generated/i18n.generated';
import type { MailJobData, MailOptions, MailRenderContext, MailTemplate } from '@/types';
import { resolvePath } from '@/utils';

@Injectable()
export class MailsService implements OnModuleInit, OnModuleDestroy {
  private readonly templatesCache = new Map<string, Handlebars.TemplateDelegate>();

  constructor(
    private readonly i18n: I18nService<I18nTranslations>,
    @Inject(emailConfig.KEY) private readonly emailCfg: EmailConfig,
    @Inject(mainConfig.KEY) private readonly mainCfg: MainConfig,
    @InjectPinoLogger(MailsService.name) private readonly logger: PinoLogger,
    @InjectQueue(QUEUES.SEND_MAIL) private mailQueue: Queue,
  ) {}

  public async onModuleInit() {
    Handlebars.registerHelper('t', this.i18n.hbsHelper.bind(this.i18n));
    this.preloadTemplates().catch((err) => this.logger.warn({ err }, 'Preloading email templates failed, will load lazily'));
  }

  public async onModuleDestroy() {
    await this.mailQueue.close();
  }

  public sendEmailVerificationEmail(email: string, token: string) {
    return this.queueTokenMail(email, token, EmailTypes.VERIFICATION);
  }

  public sendRecoverAccountEmail(email: string, token: string) {
    return this.queueTokenMail(email, token, EmailTypes.RECOVER_ACCOUNT);
  }

  public sendResetPasswordEmail(email: string, token: string) {
    return this.queueTokenMail(email, token, EmailTypes.RESET_PASSWORD);
  }

  private async queueTokenMail(email: string, token: string, type: EmailTypes): Promise<void> {
    const lang = I18nContext.current()?.lang || this.mainCfg.defaultLanguage;

    const { template, subjectKey, link } = this.getMailOptions(type);
    const subject = this.i18n.t(subjectKey, { lang }) as string;
    const linkWithToken = `${link}?token=${token}`;

    const html = await this.renderTemplate(template, { [`${template}-link`]: linkWithToken, i18nLang: lang });
    const from = `${this.emailCfg.fromName} <${this.emailCfg.from}>`;
    const job: MailJobData = { to: email, subject, html, from, template };

    await this.mailQueue.add(template, job);

    this.logger.info({ to: email, template }, 'Mail enqueued');
  }

  private async preloadTemplates() {
    const templates: MailTemplate[] = ['email-verification', 'reset-password', 'recover-account'];
    await Promise.all(templates.map((t) => this.loadTemplate(t)));
    this.logger.info('Email templates preloaded');
  }

  private async renderTemplate(templateName: MailTemplate, context: MailRenderContext): Promise<string> {
    if (!this.templatesCache.has(templateName)) await this.loadTemplate(templateName);
    return this.templatesCache.get(templateName)!(context);
  }

  private async loadTemplate(templateName: MailTemplate) {
    try {
      const filePath = join(resolvePath('templates'), `${templateName}.hbs`);
      const source = await fs.readFile(filePath, 'utf8');
      const compiled = Handlebars.compile(source);
      this.templatesCache.set(templateName, compiled);
      this.logger.debug({ templateName }, 'Loaded email template');
    } catch (error) {
      this.logger.warn({ templateName, error }, 'Template load failed (will try lazy load)');
      throw error;
    }
  }

  private getMailOptions(type: EmailTypes): MailOptions {
    switch (type) {
      case EmailTypes.VERIFICATION:
        return {
          template: 'email-verification' as MailTemplate,
          subjectKey: 'mails.EMAIL_VERIFICATION.SUBJECT',
          link: this.mainCfg.emailVerificationUrl,
        };
      case EmailTypes.RESET_PASSWORD:
        return {
          template: 'reset-password' as MailTemplate,
          subjectKey: 'mails.RESET_PASSWORD.SUBJECT',
          link: this.mainCfg.resetPasswordUrl,
        };
      case EmailTypes.RECOVER_ACCOUNT:
        return {
          template: 'recover-account' as MailTemplate,
          subjectKey: 'mails.RECOVER_ACCOUNT.SUBJECT',
          link: this.mainCfg.recoveryAccountUrl,
        };
      default:
        throw new InternalServerErrorException(`Unsupported email type: ${type}`);
    }
  }
}
