import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiForgotPasswordDocs, ApiResetPasswordDocs, ApiSetPasswordDocs, ApiUpdatePasswordDocs } from '@/auth/docs/definitions/auth-password.doc';
import { ForgotPasswordRequest, ResetPasswordRequest, SetPasswordRequest, UpdatePasswordRequest } from '@/auth/dtos/password';
import { AuthPasswordService } from '@/auth/services/auth-password.service';
import { AUTH_PASSWORD_TAG } from '@/constants';
import { CurrentUser, Private } from '@/decorators';
import { UserModel } from '@/models';

@ApiTags(AUTH_PASSWORD_TAG.NAME)
@Controller('auth')
export class AuthPasswordController {
  constructor(private readonly authPasswordService: AuthPasswordService) {}

  @Post('forgot-password')
  @ApiForgotPasswordDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async forgotPassword(@Body() body: ForgotPasswordRequest): Promise<void> {
    await this.authPasswordService.forgotPassword(body);
  }

  @Post('reset-password')
  @ApiResetPasswordDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async resetPassword(@Body() body: ResetPasswordRequest): Promise<void> {
    await this.authPasswordService.resetPassword(body);
  }

  @Patch('update-password')
  @ApiUpdatePasswordDocs()
  @Private()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updatePassword(@Body() body: UpdatePasswordRequest, @CurrentUser() user: UserModel): Promise<void> {
    await this.authPasswordService.updatePassword(user, body);
  }

  @Put('set-password')
  @ApiSetPasswordDocs()
  @Private()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async setPassword(@Body() body: SetPasswordRequest, @CurrentUser() user: UserModel): Promise<void> {
    await this.authPasswordService.setPassword(user, body);
  }
}
