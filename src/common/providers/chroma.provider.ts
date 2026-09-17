import type { Provider } from '@nestjs/common';
import { ChromaClient } from 'chromadb';

import type { ChromaConfig } from '@/configs';
import { chromaConfig } from '@/configs';
import { TOKENS } from '@/constants';

export const ChromaProvider: Provider<ChromaClient> = {
  provide: TOKENS.CHROMA,
  inject: [chromaConfig.KEY],
  useFactory: (config: ChromaConfig) => {
    return new ChromaClient({ host: config.host, port: config.port });
  },
};
