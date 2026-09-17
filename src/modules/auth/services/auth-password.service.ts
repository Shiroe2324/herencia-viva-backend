import { ConflictException, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';

import { ForgotPasswordRequest, ResetPasswordRequest, SetPasswordRequest, UpdatePasswordRequest } from '@/auth/dtos/password';
import { AuthHelperService } from '@/auth/services/auth-helper.service';
import { MainConfig, mainConfig } from '@/configs';
import { AUTH_ERROR_CODES } from '@/constants';
import { UserTokens } from '@/enums';
import { MailsService } from '@/mails/mails.service';
import { UserModel } from '@/models';
import { UserTokenRepositoryService } from '@/repositories/services/user-token.service';
import { UserRepositoryService } from '@/repositories/services/user.service';
import { comparePassword, hashPassword } from '@/utils';

@Injectable()
export class AuthPasswordService {
  constructor(
    private readonly helperService: AuthHelperService,
    private readonly mailsService: MailsService,
    private readonly userRepository: UserRepositoryService,
    private readonly userTokenRepository: UserTokenRepositoryService,
    @Inject(mainConfig.KEY) private readonly mainCfg: MainConfig,
  ) {}

  public async forgotPassword(data: ForgotPasswordRequest) {
    const { email } = data;
    const user = await this.helperService.getVerifiedCredentialUser(email);

    const alreadySent = await this.userTokenRepository.existsBy({ user: { id: user.id }, type: UserTokens.RESET_PASSWORD });
    if (alreadySent) throw new ForbiddenException(AUTH_ERROR_CODES.PASSWORD_RESET_PENDING);

    const resetPasswordToken = randomBytes(32).toString('hex');
    const expirationDate = new Date(Date.now() + this.mainCfg.resetPasswordExpiration);

    await this.userTokenRepository.create({ content: resetPasswordToken, expirationDate, type: UserTokens.RESET_PASSWORD, user });
    await this.mailsService.sendResetPasswordEmail(email, resetPasswordToken);
  }

  public async resetPassword(data: ResetPasswordRequest) {
    const { token: resetPasswordToken, newPassword } = data;
    const token = await this.helperService.getToken(resetPasswordToken, UserTokens.RESET_PASSWORD);
    const user = token.user;

    if (token.expirationDate < new Date()) {
      await this.userTokenRepository.delete({ id: token.id });
      throw new ForbiddenException(AUTH_ERROR_CODES.TOKEN_EXPIRED);
    }

    const password = hashPassword(newPassword);

    await this.userRepository.update({ id: user.id }, { password });
    await this.userTokenRepository.delete({ id: token.id });
  }

  public async updatePassword(user: UserModel, data: UpdatePasswordRequest) {
    const { currentPassword, newPassword, token } = data;

    if (user.mfa?.enabled) {
      await this.helperService.verifyMfaToken(user, token!);
    }

    if (!user.password) throw new ForbiddenException(AUTH_ERROR_CODES.USER_EXTERNAL_REQUIRED);

    const isPasswordValid = comparePassword(currentPassword, user.password);
    if (!isPasswordValid) throw new UnauthorizedException(AUTH_ERROR_CODES.PASSWORD_INVALID);

    const isSamePassword = comparePassword(newPassword, user.password);
    if (isSamePassword) throw new ConflictException(AUTH_ERROR_CODES.PASSWORD_SAME_AS_CURRENT);

    const password = hashPassword(newPassword);
    await this.userRepository.update({ id: user.id }, { password });
  }

  public async setPassword(user: UserModel, data: SetPasswordRequest) {
    const { newPassword } = data;

    if (!user.externalId) throw new ForbiddenException(AUTH_ERROR_CODES.USER_EXTERNAL_REQUIRED);
    if (user.password) throw new ConflictException(AUTH_ERROR_CODES.PASSWORD_FORBIDDEN);

    const password = hashPassword(newPassword);
    await this.userRepository.update({ id: user.id }, { password });
  }
}
