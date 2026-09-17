import { Module } from '@nestjs/common';

import { FilesService } from '@/files/files.service';
import { MinioProvider } from '@/providers';

@Module({
  providers: [MinioProvider, FilesService],
  exports: [MinioProvider, FilesService],
})
export class FilesModule {}
