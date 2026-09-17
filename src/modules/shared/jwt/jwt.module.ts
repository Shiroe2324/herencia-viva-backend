import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

import { JwtService } from '@/jwt/jwt.service';
import { RepositoriesModule } from '@/repositories/repositories.module';

@Module({
  imports: [RepositoriesModule, NestJwtModule.register({})],
  providers: [JwtService],
  exports: [JwtService, RepositoriesModule],
})
export class JwtModule {}
