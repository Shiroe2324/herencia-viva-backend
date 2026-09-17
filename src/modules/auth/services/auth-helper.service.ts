import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import { v4 as uuidv4 } from 'uuid';

import { OtpSessionCacheService } from '@/cache/otp-session-cache.service';
import { AUTH_ERROR_CODES } from '@/constants';
import { AuthSessionLogStatus, AuthTokens, MfaTypes, UserTokens } from '@/enums';
import type { AuthSessionLogFailureReason } from '@/enums';
import { JwtService } from '@/jwt/jwt.service';
import { UserModel } from '@/models';
import { AuthSessionLogRepositoryService } from '@/repositories/services/auth-session-log.service';
import { UserMfaRepositoryService } from '@/repositories/services/user-mfa.service';
import { UserTokenRepositoryService } from '@/repositories/services/user-token.service';
import { UserRepositoryService } from '@/repositories/services/user.service';
import type { ClientMeta } from '@/types';
import { compareHash, createHash, decrypt, parseUserAgent, resolveGeoLocation } from '@/utils';

@Injectable()
export class AuthHelperService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authSessionLogRepository: AuthSessionLogRepositoryService,
    private readonly userRepository: UserRepositoryService,
    private readonly userMfaRepository: UserMfaRepositoryService,
    private readonly userTokenRepository: UserTokenRepositoryService,
    private readonly otpSessionCache: OtpSessionCacheService,
  ) {}

  public async generateTokens(user: UserModel, sessionId?: string, meta?: ClientMeta) {
    const sid = sessionId ?? uuidv4();

    const { token: accessToken, expiresIn: accessExpiresIn } = await this.jwtService.generateToken(user, AuthTokens.ACCESS, sid);
    const { token: refreshToken, expiresIn: refreshExpiresIn } = await this.jwtService.generateToken(user, AuthTokens.REFRESH, sid);
    await this.jwtService.linkTokens(accessToken, refreshToken);

    if (meta) {
      const parsedUserAgent = parseUserAgent(meta.userAgent);
      const parsedGeoLocation = resolveGeoLocation(meta.ipAddress);

      await this.authSessionLogRepository.createLog({
        sessionId: sid,
        status: AuthSessionLogStatus.SUCCESS,
        failureReason: null,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        revokedAt: null,
        user,
        ...parsedUserAgent,
        ...parsedGeoLocation,
      });
    }

    return { accessToken, refreshToken, accessExpiresIn, refreshExpiresIn, sessionId: sid };
  }

  public async recordFailedAttempt(user: UserModel, reason: AuthSessionLogFailureReason, meta: ClientMeta): Promise<void> {
    const parsedUserAgent = parseUserAgent(meta.userAgent);
    const parsedGeoLocation = resolveGeoLocation(meta.ipAddress);

    await this.authSessionLogRepository.createLog({
      sessionId: null,
      status: AuthSessionLogStatus.FAILED,
      failureReason: reason,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      revokedAt: null,
      ...parsedUserAgent,
      ...parsedGeoLocation,
      user,
    });
  }

  public async getToken(token: string, type: UserTokens) {
    const hash = createHash(token);
    const foundToken = await this.userTokenRepository.findOneWithUser({ hash, type });
    if (!foundToken) throw new NotFoundException(AUTH_ERROR_CODES.TOKEN_NOT_FOUND);

    return foundToken;
  }

  public async getVerifiedCredentialUser(identifier: string) {
    const user = await this.userRepository.findOneWithDetails([{ username: identifier }, { email: identifier }]);

    if (!user) throw new NotFoundException(AUTH_ERROR_CODES.USER_NOT_FOUND);
    if (!user.password) throw new ForbiddenException(AUTH_ERROR_CODES.PASSWORD_REQUIRED);
    if (!user.isEmailVerified) throw new ForbiddenException(AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED);

    return user as UserModel & { password: string };
  }

  public async createOtpSession(user: UserModel): Promise<string> {
    const sessionId = uuidv4();
    await this.otpSessionCache.set(sessionId, user.id);
    return sessionId;
  }

  public async validateOtpSession(sessionId: string): Promise<UserModel> {
    const session = await this.otpSessionCache.get(sessionId);
    if (!session) throw new UnauthorizedException(AUTH_ERROR_CODES.OTP_SESSION_INVALID);

    const user = await this.userRepository.findOneWithDetails({ id: session.userId });
    if (!user) {
      await this.otpSessionCache.delete(sessionId);
      throw new NotFoundException(AUTH_ERROR_CODES.USER_NOT_FOUND);
    }

    await this.otpSessionCache.delete(sessionId);

    return user;
  }

  public async verifyMfaToken(user: UserModel, token: string) {
    const mfa = user.mfa;
    if (!mfa?.enabled || !mfa.secret) throw new ForbiddenException(AUTH_ERROR_CODES.MFA_REQUIRED);

    const secret = decrypt(mfa.secret);
    const isTotpValid = speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 });

    if (isTotpValid) return { type: MfaTypes.TOTP };

    if (!Array.isArray(mfa.backupCodes) || mfa.backupCodes.length === 0) {
      throw new UnauthorizedException(AUTH_ERROR_CODES.MFA_TOKEN_INVALID);
    }

    const idx = mfa.backupCodes.findIndex((h) => compareHash(token, h));
    if (idx === -1) throw new UnauthorizedException(AUTH_ERROR_CODES.MFA_TOKEN_INVALID);

    const mfaBackupCodes = [...mfa.backupCodes];
    mfaBackupCodes.splice(idx, 1);
    user.mfa = { ...mfa, backupCodes: mfaBackupCodes };
    await this.userMfaRepository.update({ id: mfa.id }, { backupCodes: mfaBackupCodes });

    return { type: MfaTypes.BACKUP };
  }
}
