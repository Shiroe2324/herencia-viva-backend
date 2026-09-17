import type { PathImpl2 } from '@nestjs/config';

import type { I18nTranslations } from '@/generated/i18n.generated';

export type MailTemplate = 'email-verification' | 'reset-password' | 'recover-account';

export interface MailRenderContext {
  i18nLang?: string;
  [k: string]: unknown;
}

export interface MailJobData {
  to: string;
  subject: string;
  html: string;
  from?: string;
  template?: MailTemplate;
  meta?: Record<string, unknown>;
}

export interface MailOptions {
  template: MailTemplate;
  subjectKey: PathImpl2<I18nTranslations>;
  link: string;
}
