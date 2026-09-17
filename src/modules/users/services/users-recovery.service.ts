import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';

import { mainConfig, MainConfig } from '@/configs';
import { USERS_ERROR_CODES } from '@/constants';
import { UserTokens } from '@/enums';
import { MailsService } from '@/mails/mails.service';
import { UserPictureRepositoryService } from '@/repositories/services/user-picture.service';
import { UserTokenRepositoryService } from '@/repositories/services/user-token.service';
import { UserRepositoryService } from '@/repositories/services/user.service';
import { RecoverAccountRequest } from '@/users/dtos/recovery';
import { UsersCoreService } from '@/users/services/users-core.service';
import { createHash } from '@/utils';

@Injectable()
export class UsersRecoveryService {
  constructor(
    private readonly coreService: UsersCoreService,
    private readonly mailsService: MailsService,
    private readonly userRepository: UserRepositoryService,
    private readonly userTokenRepository: UserTokenRepositoryService,
    private readonly userPictureRepository: UserPictureRepositoryService,
    @Inject(mainConfig.KEY) private readonly mainCfg: MainConfig,
  ) {}

  public async recoverAccount(data: RecoverAccountRequest): Promise<void> {
    const { token: tokenValue } = data;

    const hash = createHash(tokenValue);
    const token = await this.userTokenRepository.findOneWithUser({ hash });
    if (!token) throw new NotFoundException(USERS_ERROR_CODES.RECOVERY_TOKEN_NOT_FOUND);

    if (token.expirationDate < new Date()) {
      await this.userTokenRepository.delete({ id: token.id });
      throw new UnauthorizedException(USERS_ERROR_CODES.RECOVERY_TOKEN_EXPIRED);
    }

    await this.userRepository.restore({ id: token.user.id });
    if (token.user.picture) await this.userPictureRepository.restore({ id: token.user.picture.id });
    await this.userTokenRepository.delete({ id: token.id });
  }

  public async sendRecoveryEmail(identifier: string): Promise<void> {
    const user = await this.coreService.getOne(identifier, true);
    if (!user.deletedAt) throw new ConflictException(USERS_ERROR_CODES.USER_NOT_DELETED);

    const alreadySent = await this.userTokenRepository.existsBy({ user: { id: user.id }, type: UserTokens.RECOVER_ACCOUNT });
    if (alreadySent) throw new ConflictException(USERS_ERROR_CODES.RECOVERY_TOKEN_ALREADY_SENT);

    const tokenValue = randomBytes(32).toString('hex');
    const expirationDate = new Date(Date.now() + this.mainCfg.recoveryAccountExpiration);

    await this.userTokenRepository.create({ content: tokenValue, expirationDate, type: UserTokens.RECOVER_ACCOUNT, user });
    await this.mailsService.sendRecoverAccountEmail(user.email, tokenValue);
  }
}
