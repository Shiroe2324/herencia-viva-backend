import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import type { Profile, VerifyCallback } from 'passport-apple';
import { Strategy } from 'passport-apple';

import { AuthAppleService } from '@/auth/services/auth-apple.service';
import { appleConfig, AppleConfig } from '@/configs';
import { AuthStrategies } from '@/enums';
import type { AppleFormProfile, AppleIdTokenPayload } from '@/types';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, AuthStrategies.APPLE) {
  constructor(
    private readonly authAppleService: AuthAppleService,
    @Inject(appleConfig.KEY) private readonly appleCfg: AppleConfig,
  ) {
    super({
      clientID: appleCfg.clientId,
      teamID: appleCfg.teamId,
      keyID: appleCfg.keyId,
      privateKeyString: appleCfg.privateKey,
      callbackURL: appleCfg.callbackUrl,
      passReqToCallback: true,
    });
  }

  public async validate(
    req: Request & { appleProfile?: AppleFormProfile },
    _accessToken: string,
    _refreshToken: string,
    idToken: string,
    _profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64url').toString()) as AppleIdTokenPayload;
    const externalId = payload.sub;
    const email = payload.email;
    const { firstName, lastName } = req.appleProfile?.name ?? {};
    const displayName = [firstName, lastName].filter(Boolean).join(' ') || undefined;
    const user = await this.authAppleService.findOrCreateAppleUser(externalId, email, displayName);
    return done(null, user);
  }
}
