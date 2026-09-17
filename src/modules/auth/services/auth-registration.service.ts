import { ConflictException, ForbiddenException, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { randomBytes } from 'crypto';

import { RegisterRequest, VerifyEmailRequest } from '@/auth/dtos/registration';
import { AuthHelperService } from '@/auth/services/auth-helper.service';
import { mainConfig, MainConfig } from '@/configs';
import { AUTH_ERROR_CODES } from '@/constants';
import { UserRoles, UserTokens } from '@/enums';
import { MailsService } from '@/mails/mails.service';
import { UserClientRepositoryService } from '@/repositories/services/user-client.service';
import { UserRoleRepositoryService } from '@/repositories/services/user-role.service';
import { UserTokenRepositoryService } from '@/repositories/services/user-token.service';
import { UserRepositoryService } from '@/repositories/services/user.service';
import { hashPassword } from '@/utils';

@Injectable()
export class AuthRegistrationService {
  constructor(
    private readonly helperService: AuthHelperService,
    private readonly mailsService: MailsService,
    private readonly userRepository: UserRepositoryService,
    private readonly userRoleRepository: UserRoleRepositoryService,
    private readonly userTokenRepository: UserTokenRepositoryService,
    private readonly clientRepository: UserClientRepositoryService,
    @Inject(mainConfig.KEY) private readonly mainCfg: MainConfig,
  ) {}

  public async register(data: RegisterRequest) {
    const { email, password, username, displayName, phone, gender, age } = data;

    const existingUser = await this.userRepository.existsBy([{ email }, { username }]);
    if (existingUser) throw new ConflictException(AUTH_ERROR_CODES.USER_ALREADY_EXISTS);

    const userRole = await this.userRoleRepository.findOneBy({ name: UserRoles.USER });
    if (!userRole) throw new ServiceUnavailableException(AUTH_ERROR_CODES.ROLE_NOT_FOUND);

    const hashedPassword = hashPassword(password);
    const emailVerificationToken = randomBytes(32).toString('hex');
    const expirationDate = new Date(Date.now() + this.mainCfg.emailVerificationExpiration);

    const user = await this.userRepository.create({ username, displayName, email, password: hashedPassword, roles: [userRole] });
    await this.clientRepository.create({ user, phone, gender, age });
    await this.userTokenRepository.create({ content: emailVerificationToken, expirationDate, type: UserTokens.EMAIL_VERIFICATION, user });

    await this.mailsService.sendEmailVerificationEmail(email, emailVerificationToken);
  }

  public async verifyEmail(data: VerifyEmailRequest) {
    const token = await this.helperService.getToken(data.token, UserTokens.EMAIL_VERIFICATION);
    const user = token.user;

    await this.userTokenRepository.delete({ id: token.id });

    if (token.expirationDate < new Date()) {
      await this.userRepository.delete({ id: user.id });
      throw new ForbiddenException(AUTH_ERROR_CODES.TOKEN_EXPIRED);
    }

    await this.userRepository.verifyUser(user.id);
  }
}
