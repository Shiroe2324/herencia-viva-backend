import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { USERS_RECOVERY_TAG } from '@/constants';
import { ApiRecoverAccountDocs, ApiSendRecoveryEmailDocs } from '@/users/docs/definitions/users-recovery.doc';
import { RecoverAccountRequest, SendRecoveryEmailRequest } from '@/users/dtos/recovery';
import { UsersRecoveryService } from '@/users/services/users-recovery.service';

@ApiTags(USERS_RECOVERY_TAG.NAME)
@Controller('users/recover-account')
export class UsersRecoveryController {
  constructor(private readonly usersRecoveryService: UsersRecoveryService) {}

  @Post()
  @ApiRecoverAccountDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async recoverAccount(@Body() body: RecoverAccountRequest): Promise<void> {
    await this.usersRecoveryService.recoverAccount(body);
  }

  @Post('send-email')
  @ApiSendRecoveryEmailDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async sendRecoveryEmail(@Body() body: SendRecoveryEmailRequest): Promise<void> {
    await this.usersRecoveryService.sendRecoveryEmail(body.identifier);
  }
}
