import { ConflictException, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';

import { DisableMfaRequest, EnableMfaRequest, RegenerateMfaBackupCodesRequest, ValidateMfaLoginRequest } from '@/auth/dtos/mfa';
import { AuthHelperService } from '@/auth/services/auth-helper.service';
import { MainConfig, mainConfig } from '@/configs';
import { AUTH_ERROR_CODES } from '@/constants';
import { AuthSessionLogFailureReason } from '@/enums';
import { UserModel } from '@/models';
import { UserMfaRepositoryService } from '@/repositories/services/user-mfa.service';
import { UserRepositoryService } from '@/repositories/services/user.service';
import type { ClientMeta } from '@/types';
import { comparePassword, createHash, encrypt } from '@/utils';

@Injectable()
export class AuthMfaService {
  constructor(
    private readonly helperService: AuthHelperService,
    private readonly userRepository: UserRepositoryService,
    private readonly userMfaRepository: UserMfaRepositoryService,
    @Inject(mainConfig.KEY) private readonly mainCfg: MainConfig,
  ) {}

  public async generateMfaTempSecret(user: UserModel) {
    if (!user.password) throw new ForbiddenException(AUTH_ERROR_CODES.PASSWORD_REQUIRED);

    const secret = speakeasy.generateSecret({ name: `${this.mainCfg.appName}:${user.email}` });
    const otpauthUrl = secret.otpauth_url as string;
    const qr = await qrcode.toDataURL(otpauthUrl);

    return { base32: secret.base32, otpauthUrl, qr };
  }

  public async enableMfa(user: UserModel, data: EnableMfaRequest) {
    const { password, token, base32 } = data;

    const ok = speakeasy.totp.verify({ secret: base32, encoding: 'base32', token, window: 1 });
    if (!ok) throw new ForbiddenException(AUTH_ERROR_CODES.MFA_TOKEN_INVALID);

    if (user.mfa?.enabled || user.mfa?.secret || user.mfa?.backupCodes || user.mfa?.backupCodesGeneratedAt) {
      throw new ConflictException(AUTH_ERROR_CODES.MFA_ALREADY_ENABLED);
    }

    if (!user.password) throw new ForbiddenException(AUTH_ERROR_CODES.PASSWORD_REQUIRED);

    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException(AUTH_ERROR_CODES.PASSWORD_INVALID);

    const encrypted = encrypt(base32);
    const { rawCodes, hashedCodes } = this.createBackupCodes();

    const secret = encrypted;
    const enabled = true;
    const backupCodes = hashedCodes;
    const backupCodesGeneratedAt = new Date();

    if (user.mfa?.id) {
      await this.userMfaRepository.update({ id: user.mfa.id }, { secret, enabled, backupCodes, backupCodesGeneratedAt });
    } else {
      await this.userMfaRepository.create({ user, secret, enabled, backupCodes, backupCodesGeneratedAt });
    }

    return { backupCodes: rawCodes };
  }

  public async disableMfa(user: UserModel, data: DisableMfaRequest) {
    if (!user.mfa?.enabled || !user.mfa?.secret || !user.mfa?.backupCodes || !user.mfa?.backupCodesGeneratedAt) {
      throw new ConflictException(AUTH_ERROR_CODES.MFA_REQUIRED);
    }

    if (!user.password) throw new ForbiddenException(AUTH_ERROR_CODES.PASSWORD_REQUIRED);

    const isPasswordValid = comparePassword(data.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException(AUTH_ERROR_CODES.PASSWORD_INVALID);

    await this.helperService.verifyMfaToken(user, data.token);
    await this.userMfaRepository.delete({ id: user.mfa.id });
  }

  public async validateMfaLogin(data: ValidateMfaLoginRequest, meta: ClientMeta) {
    const user = await this.helperService.validateOtpSession(data.otpSessionId);

    let type: Awaited<ReturnType<typeof this.helperService.verifyMfaToken>>['type'];
    try {
      ({ type } = await this.helperService.verifyMfaToken(user, data.token));
    } catch (error) {
      await this.helperService.recordFailedAttempt(user, AuthSessionLogFailureReason.INVALID_MFA_TOKEN, meta);
      throw error;
    }

    const tokenData = await this.helperService.generateTokens(user, undefined, meta);
    const remainingBackupCodes = user.mfa?.backupCodes?.length ?? 0;

    await this.userRepository.update({ id: user.id }, { lastLoginAt: new Date() });

    return { ...tokenData, type, remainingBackupCodes };
  }

  public async regenerateMfaBackupCodes(user: UserModel, data: RegenerateMfaBackupCodesRequest) {
    if (!user.mfa?.enabled || !user.mfa?.backupCodes || !user.mfa?.backupCodesGeneratedAt) {
      throw new ForbiddenException(AUTH_ERROR_CODES.MFA_REQUIRED);
    }

    if (Date.now() - user.mfa.backupCodesGeneratedAt.getTime() < 1000 * 60 * 60 * 24 * 7) {
      throw new ConflictException(AUTH_ERROR_CODES.MFA_REGENERATION_RATE_LIMITED);
    }

    if (!user.password) throw new ForbiddenException(AUTH_ERROR_CODES.PASSWORD_REQUIRED);

    const { password, token } = data;
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException(AUTH_ERROR_CODES.PASSWORD_INVALID);
    await this.helperService.verifyMfaToken(user, token);

    const { rawCodes, hashedCodes } = this.createBackupCodes();

    const backupCodes = hashedCodes;
    const backupCodesGeneratedAt = new Date();
    await this.userMfaRepository.update({ id: user.mfa.id }, { backupCodes, backupCodesGeneratedAt });

    return { backupCodes: rawCodes };
  }

  private createBackupCodes() {
    const rawCodes = Array.from({ length: 10 }, () => randomBytes(4).toString('hex'));
    const hashedCodes = rawCodes.map((c) => createHash(c));
    return { rawCodes, hashedCodes };
  }
}
