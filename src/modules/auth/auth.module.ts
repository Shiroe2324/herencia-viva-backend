import { Module } from '@nestjs/common';

import { AuthAppleController } from '@/auth/controllers/auth-apple.controller';
import { AuthGoogleController } from '@/auth/controllers/auth-google.controller';
import { AuthMfaController } from '@/auth/controllers/auth-mfa.controller';
import { AuthPasswordController } from '@/auth/controllers/auth-password.controller';
import { AuthRegistrationController } from '@/auth/controllers/auth-registration.controller';
import { AuthSessionLogsController } from '@/auth/controllers/auth-session-logs.controller';
import { AuthSessionController } from '@/auth/controllers/auth-session.controller';
import { AuthAppleService } from '@/auth/services/auth-apple.service';
import { AuthGoogleService } from '@/auth/services/auth-google.service';
import { AuthHelperService } from '@/auth/services/auth-helper.service';
import { AuthMfaService } from '@/auth/services/auth-mfa.service';
import { AuthPasswordService } from '@/auth/services/auth-password.service';
import { AuthRegistrationService } from '@/auth/services/auth-registration.service';
import { AuthSessionLogsService } from '@/auth/services/auth-session-logs.service';
import { AuthSessionService } from '@/auth/services/auth-session.service';
import { CacheModule } from '@/cache/cache.module';
import { JwtModule } from '@/jwt/jwt.module';
import { MailsModule } from '@/mails/mails.module';
import { RepositoriesModule } from '@/repositories/repositories.module';
import { AppleStrategy } from '@/strategies/apple.strategy';
import { GoogleStrategy } from '@/strategies/google.strategy';
import { JwtStrategy } from '@/strategies/jwt.strategy';

@Module({
  imports: [CacheModule, JwtModule, MailsModule, RepositoriesModule],
  providers: [
    AuthAppleService,
    AuthGoogleService,
    AuthHelperService,
    AuthMfaService,
    AuthPasswordService,
    AuthRegistrationService,
    AuthSessionLogsService,
    AuthSessionService,
    GoogleStrategy,
    AppleStrategy,
    JwtStrategy,
  ],
  controllers: [
    AuthAppleController,
    AuthGoogleController,
    AuthMfaController,
    AuthPasswordController,
    AuthRegistrationController,
    AuthSessionLogsController,
    AuthSessionController,
  ],
  exports: [
    AuthAppleService,
    AuthGoogleService,
    AuthHelperService,
    AuthMfaService,
    AuthPasswordService,
    AuthRegistrationService,
    AuthSessionLogsService,
    AuthSessionService,
  ],
})
export class AuthModule {}
