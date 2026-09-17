import type { Provider } from '@nestjs/common';
import { Resend } from 'resend';

import type { EmailConfig } from '@/configs';
import { emailConfig } from '@/configs';
import { TOKENS } from '@/constants';

export const ResendProvider: Provider<Resend> = {
  provide: TOKENS.RESEND,
  inject: [emailConfig.KEY],
  useFactory: (config: EmailConfig) => {
    return new Resend(config.apiKey);
  },
};
