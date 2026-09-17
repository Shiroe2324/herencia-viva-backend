import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Profile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy } from 'passport-google-oauth20';

import { AuthGoogleService } from '@/auth/services/auth-google.service';
import { googleConfig, GoogleConfig } from '@/configs';
import { AuthStrategies } from '@/enums';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, AuthStrategies.GOOGLE) {
  constructor(
    private readonly authGoogleService: AuthGoogleService,
    @Inject(googleConfig.KEY) private readonly googleCfg: GoogleConfig,
  ) {
    super({ clientID: googleCfg.clientId, clientSecret: googleCfg.clientSecret, callbackURL: googleCfg.callbackUrl, scope: ['email', 'profile'] });
  }

  public async validate(_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    const { id: externalId, displayName, emails, photos } = profile;
    const email = emails?.[0]?.value;
    const pictureUrl = photos?.[0]?.value;
    const user = await this.authGoogleService.findOrCreateGoogleUser(externalId, email, displayName, pictureUrl);
    return done(null, user);
  }
}
