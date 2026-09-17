import { ConflictException, ForbiddenException, Inject, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

import { GoogleExternalLoginRequest } from '@/auth/dtos/google';
import { AuthHelperService } from '@/auth/services/auth-helper.service';
import { GoogleConfig, googleConfig } from '@/configs';
import { AUTH_ERROR_CODES } from '@/constants';
import { UserRoles } from '@/enums';
import { UserModel } from '@/models';
import { UserPictureRepositoryService } from '@/repositories/services/user-picture.service';
import { UserRoleRepositoryService } from '@/repositories/services/user-role.service';
import { UserRepositoryService } from '@/repositories/services/user.service';
import { parseDisplayName } from '@/utils';

@Injectable()
export class AuthGoogleService {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly helperService: AuthHelperService,
    private readonly userRepository: UserRepositoryService,
    private readonly userRoleRepository: UserRoleRepositoryService,
    private readonly userPictureRepository: UserPictureRepositoryService,
    @Inject(googleConfig.KEY) private readonly googleCfg: GoogleConfig,
  ) {
    this.googleClient = new OAuth2Client(this.googleCfg.clientId);
  }

  public async googleLogin(user: UserModel) {
    if (!user.externalId) throw new UnauthorizedException(AUTH_ERROR_CODES.USER_EXTERNAL_REQUIRED);
    await this.userRepository.update({ id: user.id }, { lastLoginAt: new Date() });
    const tokenData = await this.helperService.generateTokens(user);
    return { ...tokenData, redirectUrl: this.googleCfg.redirectUrl };
  }

  public async googleExternalLogin(data: GoogleExternalLoginRequest) {
    const { token: idToken } = data;
    const ticket = await this.googleClient.verifyIdToken({ idToken, audience: this.googleCfg.clientId }).catch(() => {
      throw new UnauthorizedException(AUTH_ERROR_CODES.GOOGLE_TOKEN_INVALID);
    });

    const payload = ticket.getPayload();
    if (!payload || (payload.iss !== 'https://accounts.google.com' && payload.iss !== 'accounts.google.com')) {
      throw new UnauthorizedException(AUTH_ERROR_CODES.GOOGLE_TOKEN_INVALID);
    }

    const { sub: externalId, email, name, picture } = payload;
    const user = await this.findOrCreateGoogleUser(externalId, email, name, picture);

    if (!user.externalId) throw new UnauthorizedException(AUTH_ERROR_CODES.USER_EXTERNAL_REQUIRED);

    await this.userRepository.update({ id: user.id }, { lastLoginAt: new Date() });
    return this.helperService.generateTokens(user);
  }

  public async findOrCreateGoogleUser(externalId: string, email?: string, name?: string, pictureUrl?: string): Promise<UserModel> {
    const user = await this.userRepository.findOneWithDetails({ externalId });
    if (user) return user;

    if (!email) throw new ForbiddenException(AUTH_ERROR_CODES.EMAIL_MISSING);

    const existingByEmail = await this.userRepository.findOneBy({ email });
    if (existingByEmail) throw new ConflictException(AUTH_ERROR_CODES.EMAIL_ALREADY_IN_USE);

    const userRole = await this.userRoleRepository.findOneBy({ name: UserRoles.USER });
    if (!userRole) throw new ServiceUnavailableException(AUTH_ERROR_CODES.ROLE_NOT_FOUND);

    const roles = [userRole];
    const pictureEntity = pictureUrl ? await this.userPictureRepository.create({ url: pictureUrl }) : undefined;
    const normalizedEmail = email.trim().toLowerCase();
    const displayName = parseDisplayName(name?.trim() || normalizedEmail.split('@')[0]);

    return this.userRepository.create({ externalId, displayName, email: normalizedEmail, roles, picture: pictureEntity, isEmailVerified: true });
  }
}
