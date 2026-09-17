import { ConflictException, ForbiddenException, Inject, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { verifyIdToken } from 'apple-signin-auth';

import { AppleExternalLoginRequest, AppleExternalLoginResponse } from '@/auth/dtos/apple';
import { AuthHelperService } from '@/auth/services/auth-helper.service';
import { appleConfig, AppleConfig } from '@/configs';
import { AUTH_ERROR_CODES } from '@/constants';
import { UserRoles } from '@/enums';
import { UserModel } from '@/models';
import { UserRoleRepositoryService } from '@/repositories/services/user-role.service';
import { UserRepositoryService } from '@/repositories/services/user.service';
import { parseDisplayName } from '@/utils';

@Injectable()
export class AuthAppleService {
  constructor(
    private readonly helperService: AuthHelperService,
    private readonly userRepository: UserRepositoryService,
    private readonly userRoleRepository: UserRoleRepositoryService,
    @Inject(appleConfig.KEY) private readonly appleCfg: AppleConfig,
  ) {}

  public async appleLogin(user: UserModel) {
    if (!user.externalId) throw new UnauthorizedException(AUTH_ERROR_CODES.USER_EXTERNAL_REQUIRED);
    await this.userRepository.update({ id: user.id }, { lastLoginAt: new Date() });
    const tokenData = await this.helperService.generateTokens(user);
    return { ...tokenData, redirectUrl: this.appleCfg.redirectUrl };
  }

  public async appleExternalLogin(data: AppleExternalLoginRequest): Promise<AppleExternalLoginResponse> {
    const { token: idToken } = data;
    const payload = await verifyIdToken(idToken, { audience: this.appleCfg.clientId }).catch(() => {
      throw new UnauthorizedException(AUTH_ERROR_CODES.APPLE_TOKEN_INVALID);
    });

    if (!payload || payload.iss !== 'https://appleid.apple.com') {
      throw new UnauthorizedException(AUTH_ERROR_CODES.APPLE_TOKEN_INVALID);
    }

    const { sub: externalId, email } = payload;
    const user = await this.findOrCreateAppleUser(externalId, email);

    if (!user.externalId) throw new UnauthorizedException(AUTH_ERROR_CODES.USER_EXTERNAL_REQUIRED);

    await this.userRepository.update({ id: user.id }, { lastLoginAt: new Date() });
    return this.helperService.generateTokens(user);
  }

  public async findOrCreateAppleUser(externalId: string, email?: string, displayName?: string): Promise<UserModel> {
    const user = await this.userRepository.findOneWithDetails({ externalId });
    if (user) return user;

    if (!email) throw new ForbiddenException(AUTH_ERROR_CODES.EMAIL_MISSING);

    const existingByEmail = await this.userRepository.findOneBy({ email });
    if (existingByEmail) throw new ConflictException(AUTH_ERROR_CODES.EMAIL_ALREADY_IN_USE);

    const userRole = await this.userRoleRepository.findOneBy({ name: UserRoles.USER });
    if (!userRole) throw new ServiceUnavailableException(AUTH_ERROR_CODES.ROLE_NOT_FOUND);

    const roles = [userRole];
    const normalizedEmail = email.trim().toLowerCase();
    const parsedDisplayName = parseDisplayName(displayName?.trim() || normalizedEmail.split('@')[0]);

    return this.userRepository.create({ externalId, displayName: parsedDisplayName, email: normalizedEmail, roles, isEmailVerified: true });
  }
}
