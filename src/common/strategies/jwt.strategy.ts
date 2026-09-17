import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { jwtConfig, JwtConfig } from '@/configs';
import { AuthStrategies, AuthTokens } from '@/enums';
import { JwtService } from '@/jwt/jwt.service';
import { UserRepositoryService } from '@/repositories/services/user.service';
import type { AuthJwtPayload } from '@/types';

const extractToken = ExtractJwt.fromAuthHeaderAsBearerToken();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthStrategies.JWT) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepositoryService,
    @Inject(jwtConfig.KEY) private readonly jwtCfg: JwtConfig,
  ) {
    super({
      jwtFromRequest: extractToken,
      ignoreExpiration: false,
      secretOrKey: jwtCfg.accessSecret,
      passReqToCallback: true,
    });
  }

  public async validate(req: Request, payload: AuthJwtPayload) {
    const token = extractToken(req);
    const isTokenBlacklisted = token ? await this.jwtService.isTokenBlacklisted(token, AuthTokens.ACCESS) : true;
    if (isTokenBlacklisted) return null;

    const user = await this.userRepository.findOneWithDetails({ id: payload.sub });
    if (!user) return null;

    (req as Request & { sessionId?: string }).sessionId = payload.sessionId;

    return user;
  }
}
