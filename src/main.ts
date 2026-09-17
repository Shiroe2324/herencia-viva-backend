import { ClassSerializerInterceptor, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import helmet from 'helmet';
import { I18nService, I18nValidationPipe } from 'nestjs-i18n';
import { Logger } from 'nestjs-pino';

import { configureSwagger } from '@/docs/setup-config.doc';
import { GlobalExceptionFilter } from '@/filters/global-exception.filter';
import type { I18nTranslations } from '@/generated/i18n.generated';
import { SnakeCaseInterceptor } from '@/interceptors/snake-case.interceptor';
import { AppModule } from '@/modules/app.module';
import { SnakeToCamelPipe } from '@/pipes/snake-to-camel.pipe';
import { UserRoleRepositoryService } from '@/repositories/services/user-role.service';
import { seedUserRoles } from '@/seeds';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const loggerService = app.get(Logger);
  const i18nService = app.get<I18nService<I18nTranslations>>(I18nService);

  const port = configService.getOrThrow<number>('main-config.backendPort');
  const seedsEnabled = configService.getOrThrow<boolean>('main-config.enableSeeds');
  const docsEnabled = configService.getOrThrow<boolean>('docs-config.enabled');

  const validationPipe = new I18nValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });
  const classSerializerInterceptor = new ClassSerializerInterceptor(app.get(Reflector), { excludeExtraneousValues: true });
  const globalExceptionFilter = new GlobalExceptionFilter(i18nService, loggerService);

  app.useLogger(loggerService);
  app.enableCors({ origin: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], credentials: true });
  app.useGlobalPipes(new SnakeToCamelPipe(), validationPipe);
  app.useGlobalFilters(globalExceptionFilter);
  app.useGlobalInterceptors(new SnakeCaseInterceptor(), classSerializerInterceptor);
  app.use(compression());
  app.use(helmet({ contentSecurityPolicy: !docsEnabled }));
  app.use(cookieParser());
  app.enableShutdownHooks();

  if (docsEnabled) {
    await configureSwagger(app, configService);
  }

  if (seedsEnabled) {
    await seedUserRoles(app.get(UserRoleRepositoryService), loggerService);
  }

  await app.listen(port, '0.0.0.0');
}
bootstrap();
