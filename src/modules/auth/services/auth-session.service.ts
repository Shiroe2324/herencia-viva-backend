import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { LoginRequest, LogoutRequest, RefreshRequest } from '@/auth/dtos/session';
import { AuthHelperService } from '@/auth/services/auth-helper.service';
import { AUTH_ERROR_CODES } from '@/constants';
import { AuthSessionLogFailureReason, AuthTokens } from '@/enums';
import { JwtService } from '@/jwt/jwt.service';
import { UserModel } from '@/models';
import { AuthSessionLogRepositoryService } from '@/repositories/services/auth-session-log.service';
import { UserRepositoryService } from '@/repositories/services/user.service';
import type { ClientMeta } from '@/types';
import { comparePassword } from '@/utils';

@Injectable()
export class AuthSessionService {
  constructor(
    private readonly helperService: AuthHelperService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepositoryService,
    private readonly authSessionLogRepository: AuthSessionLogRepositoryService,
  ) {}

  public async login(data: LoginRequest, meta: ClientMeta) {
    const user = await this.helperService.getVerifiedCredentialUser(data.identifier);

    const isPasswordValid = comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      await this.helperService.recordFailedAttempt(user, AuthSessionLogFailureReason.INVALID_PASSWORD, meta);
      throw new ForbiddenException(AUTH_ERROR_CODES.PASSWORD_INVALID);
    }

    if (user.mfa?.enabled) {
      const otpSession = await this.helperService.createOtpSession(user);
      return { mfaRequired: true, otpSessionId: otpSession };
    }

    await this.userRepository.update({ id: user.id }, { lastLoginAt: new Date() });
    const tokenData = await this.helperService.generateTokens(user, undefined, meta);
    return tokenData;
  }

  public async logout(user: UserModel, sessionId: string, data: LogoutRequest) {
    const { token: refreshToken } = data;

    const tokenPayload = this.jwtService.verifyToken(refreshToken, AuthTokens.REFRESH);
    if (tokenPayload.sub !== user.id) throw new UnauthorizedException(AUTH_ERROR_CODES.TOKEN_INVALID);

    await this.jwtService.setRelatedTokensBlacklist(refreshToken);
    await this.authSessionLogRepository.closeBySessionId(user.id, sessionId);
  }

  public async refreshTokens(data: RefreshRequest) {
    const { token: refreshToken } = data;

    const isBlacklisted = await this.jwtService.isTokenBlacklisted(refreshToken, AuthTokens.REFRESH);
    if (isBlacklisted) throw new ForbiddenException(AUTH_ERROR_CODES.TOKEN_INVALID);

    const { sub, sessionId } = this.jwtService.verifyToken(refreshToken, AuthTokens.REFRESH);
    const user = await this.userRepository.findOneBy({ id: sub });
    if (!user) throw new NotFoundException(AUTH_ERROR_CODES.USER_NOT_FOUND);
    await this.jwtService.setRelatedTokensBlacklist(refreshToken);
    const tokenData = await this.helperService.generateTokens(user, sessionId);
    return tokenData;
  }
}
