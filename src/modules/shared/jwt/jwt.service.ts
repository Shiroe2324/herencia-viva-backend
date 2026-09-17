import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtSignOptions, JwtService as NestJwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import type { VerifyOptions } from 'jsonwebtoken';
import ms from 'ms';
import type { StringValue } from 'ms';

import { JwtConfig, jwtConfig } from '@/configs';
import { AUTH_ERROR_CODES } from '@/constants';
import { AuthTokens } from '@/enums';
import { UserModel } from '@/models';
import { AuthTokenRepositoryService } from '@/repositories/services/auth-token.service';
import type { AuthJwtPayload, TokenGenerationResult } from '@/types';
import { createHash } from '@/utils';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly authTokenRepository: AuthTokenRepositoryService,
    @Inject(jwtConfig.KEY) private readonly jwtCfg: JwtConfig,
  ) {}

  public async generateToken(user: UserModel, tokenType: AuthTokens, sessionId: string): Promise<TokenGenerationResult> {
    const options = this.getTokenOptions(tokenType, true);
    const expiration = ms(options.expiresIn as StringValue);
    const expirationDate = new Date(Date.now() + expiration);

    const token = this.jwtService.sign({ sub: user.id, sessionId }, options);
    const hash = createHash(token);

    const tokenEntity = await this.authTokenRepository.createToken({ content: token, hash, expirationDate, user, type: tokenType, sessionId });
    return { token, expiresIn: expiration / 1000, tokenId: tokenEntity.id, sessionId };
  }

  public async linkTokens(token1: string, token2: string): Promise<{ token1Id: string; token2Id: string }> {
    const token1Hash = createHash(token1);
    const token2Hash = createHash(token2);

    const [entity1, entity2] = await Promise.all([
      this.authTokenRepository.findOneWithAssociatedToken({ hash: token1Hash }),
      this.authTokenRepository.findOneWithAssociatedToken({ hash: token2Hash }),
    ]);

    if (!entity1 || !entity2) throw new NotFoundException(AUTH_ERROR_CODES.TOKEN_NOT_FOUND);
    if (entity1.associatedToken || entity2.associatedToken) throw new ConflictException(AUTH_ERROR_CODES.TOKENS_ALREADY_LINKED);

    await this.authTokenRepository.linkTokens(entity1.id, entity2.id);

    return { token1Id: entity1.id, token2Id: entity2.id };
  }

  public verifyToken(token: string, tokenType: AuthTokens): AuthJwtPayload {
    return this.jwtService.verify<AuthJwtPayload>(token, this.getTokenOptions(tokenType));
  }

  public decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  public async setTokenBlacklist(token: string): Promise<{ success: boolean; tokenId?: string }> {
    const hash = createHash(token);
    const blacklistedToken = await this.authTokenRepository.blacklistByHash(hash);

    return { success: !!blacklistedToken, tokenId: blacklistedToken?.id };
  }

  public async setRelatedTokensBlacklist(token: string): Promise<{ success: boolean; tokenId?: string; associatedTokenId?: string }> {
    const hash = createHash(token);
    const storedToken = await this.authTokenRepository.findOneWithAssociatedToken({ hash, isBlacklisted: false }, true);
    if (!storedToken) return { success: false };

    const result = await this.authTokenRepository.blacklistWithAssociated(storedToken.id);
    return { success: true, tokenId: result.tokenId, associatedTokenId: result.associatedTokenId };
  }

  public async isTokenBlacklisted(token: string, tokenType?: AuthTokens): Promise<boolean> {
    const hash = createHash(token);
    const blacklistedToken = await this.authTokenRepository.findOneBy({ hash, isBlacklisted: true, ...(tokenType && { type: tokenType }) });
    return !!blacklistedToken;
  }

  private getTokenOptions(tokenType: AuthTokens, withJti = false): JwtSignOptions & VerifyOptions {
    const options: JwtSignOptions & VerifyOptions = {};

    switch (tokenType) {
      case AuthTokens.ACCESS:
        options.secret = this.jwtCfg.accessSecret;
        options.expiresIn = this.jwtCfg.accessExpiration;
        break;
      case AuthTokens.REFRESH:
        options.secret = this.jwtCfg.refreshSecret;
        options.expiresIn = this.jwtCfg.refreshExpiration;
        break;
    }

    if (withJti) {
      options.jwtid = randomBytes(16).toString('hex');
    }

    return options;
  }
}
