import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { MainConfig, mainConfig } from '@/configs';
import { AuthTokenRepositoryService } from '@/repositories/services/auth-token.service';
import { UserTokenRepositoryService } from '@/repositories/services/user-token.service';
import { UserRepositoryService } from '@/repositories/services/user.service';
import { ORM } from '@/utils';

@Injectable()
export class TasksCronsService {
  constructor(
    private readonly userRepository: UserRepositoryService,
    private readonly authTokenRepository: AuthTokenRepositoryService,
    private readonly userTokenRepository: UserTokenRepositoryService,
    @Inject(mainConfig.KEY) private readonly mainCfg: MainConfig,
    @InjectPinoLogger(TasksCronsService.name) private readonly logger: PinoLogger,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  public async clearExpiredTokensTask() {
    try {
      this.logger.info('Clearing expired tokens...');

      const cutoffDate = new Date();
      const result1 = await this.authTokenRepository.delete({ expirationDate: ORM.LessThan(cutoffDate) });
      const result2 = await this.userTokenRepository.delete({ expirationDate: ORM.LessThan(cutoffDate) });
      const affected = result1.affected && result2.affected ? result1.affected + result2.affected : 0;

      this.logger.info(`Removed ${affected} expired tokens`);
    } catch (error) {
      this.logger.error('Failed to clear expired tokens:', error instanceof Error ? error.stack : error);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  public async clearUserWithoutVerificationTask() {
    try {
      this.logger.info('Clearing users without verification...');

      const cutoffDate = new Date(Date.now() - this.mainCfg.emailVerificationExpiration);
      const result = await this.userRepository.delete({ createdAt: ORM.LessThan(cutoffDate), isEmailVerified: false });

      this.logger.info(`Removed ${result.affected} users without verification`);
    } catch (error) {
      this.logger.error('Failed to clear users without verification', error instanceof Error ? error.stack : error);
    }
  }
}
