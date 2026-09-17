import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { ApiGoogleExternalLoginDocs, ApiGoogleLoginCallbackDocs, ApiGoogleLoginDocs } from '@/auth/docs/definitions/auth-google.doc';
import { GoogleExternalLoginRequest, GoogleExternalLoginResponse } from '@/auth/dtos/google';
import { AuthGoogleService } from '@/auth/services/auth-google.service';
import { AUTH_GOOGLE_TAG } from '@/constants';
import { CurrentUser } from '@/decorators';
import { GoogleAuthGuard } from '@/guards/google-auth.guard';
import { UserModel } from '@/models';

@ApiTags(AUTH_GOOGLE_TAG.NAME)
@Controller('auth/google')
export class AuthGoogleController {
  constructor(private readonly authGoogleService: AuthGoogleService) {}

  @Get()
  @ApiGoogleLoginDocs()
  @UseGuards(GoogleAuthGuard)
  public googleAuth(): void {
    return;
  }

  @Get('callback')
  @ApiGoogleLoginCallbackDocs()
  @UseGuards(GoogleAuthGuard)
  @HttpCode(HttpStatus.FOUND)
  public async googleAuthRedirect(@CurrentUser() user: UserModel, @Res({ passthrough: true }) res: Response): Promise<void> {
    const { redirectUrl, accessToken, refreshToken } = await this.authGoogleService.googleLogin(user);
    res.redirect(`${redirectUrl}?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }

  @Post('external')
  @ApiGoogleExternalLoginDocs()
  @HttpCode(HttpStatus.OK)
  public googleExternal(@Body() body: GoogleExternalLoginRequest): Promise<GoogleExternalLoginResponse> {
    return this.authGoogleService.googleExternalLogin(body);
  }
}
