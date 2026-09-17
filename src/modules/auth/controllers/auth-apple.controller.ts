import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { ApiAppleExternalLoginDocs, ApiAppleLoginCallbackDocs, ApiAppleLoginDocs } from '@/auth/docs/definitions/auth-apple.doc';
import { AppleExternalLoginRequest, AppleExternalLoginResponse } from '@/auth/dtos/apple';
import { AuthAppleService } from '@/auth/services/auth-apple.service';
import { AUTH_APPLE_TAG } from '@/constants';
import { CurrentUser } from '@/decorators';
import { AppleAuthGuard } from '@/guards/apple-auth.guard';
import { UserModel } from '@/models';

@ApiTags(AUTH_APPLE_TAG.NAME)
@Controller('auth/apple')
export class AuthAppleController {
  constructor(private readonly authAppleService: AuthAppleService) {}

  @Get()
  @ApiAppleLoginDocs()
  @UseGuards(AppleAuthGuard)
  public appleAuth(): void {
    return;
  }

  @Post('callback')
  @ApiAppleLoginCallbackDocs()
  @UseGuards(AppleAuthGuard)
  @HttpCode(HttpStatus.FOUND)
  public async appleAuthRedirect(@CurrentUser() user: UserModel, @Res({ passthrough: true }) res: Response): Promise<void> {
    const { redirectUrl, accessToken, refreshToken } = await this.authAppleService.appleLogin(user);
    res.redirect(`${redirectUrl}?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }

  @Post('external')
  @ApiAppleExternalLoginDocs()
  @HttpCode(HttpStatus.OK)
  public appleExternal(@Body() body: AppleExternalLoginRequest): Promise<AppleExternalLoginResponse> {
    return this.authAppleService.appleExternalLogin(body);
  }
}
