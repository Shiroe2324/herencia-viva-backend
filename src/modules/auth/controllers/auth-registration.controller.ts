import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiRegisterDocs, ApiVerifyEmailDocs } from '@/auth/docs/definitions/auth-register.doc';
import { RegisterRequest, VerifyEmailRequest } from '@/auth/dtos/registration';
import { AuthRegistrationService } from '@/auth/services/auth-registration.service';
import { AUTH_REGISTRATION_TAG } from '@/constants';

@ApiTags(AUTH_REGISTRATION_TAG.NAME)
@Controller('auth')
export class AuthRegistrationController {
  constructor(private readonly authRegistrationService: AuthRegistrationService) {}

  @Post('register')
  @ApiRegisterDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async register(@Body() body: RegisterRequest): Promise<void> {
    await this.authRegistrationService.register(body);
  }

  @Post('verify-email')
  @ApiVerifyEmailDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async verifyEmail(@Body() body: VerifyEmailRequest): Promise<void> {
    await this.authRegistrationService.verifyEmail(body);
  }
}
