import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { ApiLoginDocs, ApiLogoutDocs, ApiRefreshDocs } from '@/auth/docs/definitions/auth-session.doc';
import { LoginMfaRequiredResponse, LoginRequest, LoginResponse, LogoutRequest, RefreshRequest, RefreshTokensResponse } from '@/auth/dtos/session';
import { AuthSessionService } from '@/auth/services/auth-session.service';
import { AUTH_SESSION_TAG } from '@/constants';
import { ClientMeta, CurrentSession, CurrentUser, Private } from '@/decorators';
import { UserModel } from '@/models';
import type { ClientMeta as ClientMetaType } from '@/types';

@ApiTags(AUTH_SESSION_TAG.NAME)
@Controller('auth')
export class AuthSessionController {
  constructor(private readonly authSessionService: AuthSessionService) {}

  @Post('login')
  @ApiLoginDocs()
  public async login(
    @Body() body: LoginRequest,
    @ClientMeta() meta: ClientMetaType,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse | LoginMfaRequiredResponse> {
    const response = await this.authSessionService.login(body, meta);
    if ('mfaRequired' in response && response.mfaRequired) res.status(HttpStatus.ACCEPTED);
    else res.status(HttpStatus.OK);
    return response;
  }

  @Post('logout')
  @ApiLogoutDocs()
  @Private()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@CurrentUser() user: UserModel, @CurrentSession() sessionId: string, @Body() body: LogoutRequest): Promise<void> {
    await this.authSessionService.logout(user, sessionId, body);
  }

  @Post('refresh')
  @ApiRefreshDocs()
  @HttpCode(HttpStatus.OK)
  public refresh(@Body() body: RefreshRequest): Promise<RefreshTokensResponse> {
    return this.authSessionService.refreshTokens(body);
  }
}
