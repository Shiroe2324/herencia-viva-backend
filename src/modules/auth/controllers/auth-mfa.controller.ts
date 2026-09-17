import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  ApiDisableMfaDocs,
  ApiEnableMfaDocs,
  ApiGenerateMfaDocs,
  ApiRegenerateMfaBackupCodesDocs,
  ApiValidateMfaLoginDocs,
} from '@/auth/docs/definitions/auth-mfa.doc';
import {
  DisableMfaRequest,
  EnableMfaRequest,
  EnableMfaResponse,
  GenerateMfaResponse,
  RegenerateMfaBackupCodesRequest,
  RegenerateMfaBackupCodesResponse,
  ValidateMfaLoginRequest,
  ValidateMfaLoginResponse,
} from '@/auth/dtos/mfa';
import { AuthMfaService } from '@/auth/services/auth-mfa.service';
import { AUTH_MFA_TAG } from '@/constants';
import { ClientMeta, CurrentUser, Private } from '@/decorators';
import { UserModel } from '@/models';
import type { ClientMeta as ClientMetaType } from '@/types';

@ApiTags(AUTH_MFA_TAG.NAME)
@Controller('auth/mfa')
export class AuthMfaController {
  constructor(private readonly authMfaService: AuthMfaService) {}

  @Post('generate')
  @ApiGenerateMfaDocs()
  @Private()
  @HttpCode(HttpStatus.OK)
  public generateMfa(@CurrentUser() user: UserModel): Promise<GenerateMfaResponse> {
    return this.authMfaService.generateMfaTempSecret(user);
  }

  @Post('enable')
  @ApiEnableMfaDocs()
  @Private()
  @HttpCode(HttpStatus.OK)
  public enableMfa(@Body() body: EnableMfaRequest, @CurrentUser() user: UserModel): Promise<EnableMfaResponse> {
    return this.authMfaService.enableMfa(user, body);
  }

  @Post('disable')
  @ApiDisableMfaDocs()
  @Private()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async disableMfa(@Body() body: DisableMfaRequest, @CurrentUser() user: UserModel): Promise<void> {
    await this.authMfaService.disableMfa(user, body);
  }

  @Post('validate-login')
  @ApiValidateMfaLoginDocs()
  @HttpCode(HttpStatus.OK)
  public validateMfaLogin(@Body() body: ValidateMfaLoginRequest, @ClientMeta() meta: ClientMetaType): Promise<ValidateMfaLoginResponse> {
    return this.authMfaService.validateMfaLogin(body, meta);
  }

  @Post('regenerate-codes')
  @ApiRegenerateMfaBackupCodesDocs()
  @Private()
  @HttpCode(HttpStatus.OK)
  public regenerateMfaBackupCodes(
    @Body() body: RegenerateMfaBackupCodesRequest,
    @CurrentUser() user: UserModel,
  ): Promise<RegenerateMfaBackupCodesResponse> {
    return this.authMfaService.regenerateMfaBackupCodes(user, body);
  }
}
