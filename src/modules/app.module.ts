import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { AcceptLanguageResolver, CookieResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from '@/auth/auth.module';
import { ChromaModule } from '@/chroma/chroma.module';
import {
  appleConfig,
  chromaConfig,
  databaseConfig,
  docsConfig,
  emailConfig,
  encryptionConfig,
  googleConfig,
  jwtConfig,
  limitsConfig,
  llmConfig,
  MainConfig,
  mainConfig,
  minioConfig,
  RedisConfig,
  redisConfig,
} from '@/configs';
import { dataSource } from '@/database/data-source';
import { AuthStrategies } from '@/enums';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { HealthModule } from '@/health/health.module';
import { RecommendationsModule } from '@/recommendations/recommendations.module';
import { TasksModule } from '@/tasks/tasks.module';
import { UsersModule } from '@/users/users.module';
import { resolvePath } from '@/utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [
        appleConfig,
        chromaConfig,
        databaseConfig,
        docsConfig,
        emailConfig,
        encryptionConfig,
        googleConfig,
        jwtConfig,
        limitsConfig,
        llmConfig,
        mainConfig,
        minioConfig,
        redisConfig,
      ],
    }),
    LoggerModule.forRootAsync({
      inject: [mainConfig.KEY],
      useFactory: (config: MainConfig) => ({
        pinoHttp: config.isDevelopment
          ? {
              transport: {
                target: 'pino-pretty',
                options: { colorize: true, singleLine: true, translateTime: 'HH:MM:ss', ignore: '', messageFormat: '{msg}' },
              },
            }
          : undefined,
      }),
    }),
    I18nModule.forRootAsync({
      inject: [mainConfig.KEY],
      resolvers: [new QueryResolver(['lang', 'l']), new HeaderResolver(['x-lang']), new CookieResolver(['lang']), AcceptLanguageResolver],
      useFactory: (config: MainConfig) => ({
        fallbackLanguage: config.defaultLanguage,
        viewEngine: 'hbs',
        typesOutputPath: config.isDevelopment ? resolvePath('../src/generated/i18n.generated.ts') : undefined,
        loaderOptions: { path: resolvePath('locales/'), watch: config.isDevelopment },
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [redisConfig.KEY],
      useFactory: (config: RedisConfig) => ({
        storage: new ThrottlerStorageRedisService(new Redis(config.port, config.host, { password: config.password, username: config.username })),
        throttlers: [
          { name: 'short', ttl: 1000, limit: 3 },
          { name: 'medium', ttl: 10000, limit: 20 },
          { name: 'long', ttl: 60000, limit: 100 },
        ],
      }),
    }),
    BullModule.forRootAsync({
      inject: [redisConfig.KEY],
      useFactory: (config: RedisConfig) => ({
        connection: { host: config.host, port: config.port, password: config.password },
        defaultJobOptions: {
          attempts: 5,
          backoff: { type: 'exponential', delay: 5000 },
          removeOnComplete: true,
          removeOnFail: { age: 3600, count: 100 },
        },
      }),
    }),
    TypeOrmModule.forRoot(dataSource.options),
    PassportModule.register({ defaultStrategy: AuthStrategies.JWT }),
    TasksModule,
    ChromaModule,
    RecommendationsModule,
    HealthModule,
    AuthModule,
    UsersModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
