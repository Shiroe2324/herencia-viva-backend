import { Module } from '@nestjs/common';

import { ChromaService } from '@/chroma/chroma.service';
import { ChromaProvider } from '@/providers';

@Module({
  providers: [ChromaProvider, ChromaService],
  exports: [ChromaProvider, ChromaService],
})
export class ChromaModule {}
