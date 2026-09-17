import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  ApiCloseOtherSessionsDocs,
  ApiCloseSessionDocs,
  ApiGetAllSessionLogsDocs,
  ApiGetAllUsersSessionLogsDocs,
  ApiGetCurrentSessionLogDocs,
} from '@/auth/docs/definitions/auth-session-logs.doc';
import {
  CloseOtherSessionsResponse,
  GetAllSessionLogsRequest,
  GetAllSessionLogsResponse,
  GetAllUsersSessionLogsRequest,
  GetAllUsersSessionLogsResponse,
} from '@/auth/dtos/session-logs';
import { AuthSessionLogsService } from '@/auth/services/auth-session-logs.service';
import { AUTH_SESSION_LOGS_TAG } from '@/constants';
import { CurrentSession, CurrentUser, Private, RequiredRoles } from '@/decorators';
import { UserRoles } from '@/enums';
import { AuthSessionLogModel, UserModel } from '@/models';

@ApiTags(AUTH_SESSION_LOGS_TAG.NAME)
@Controller('auth/sessions')
@Private()
export class AuthSessionLogsController {
  constructor(private readonly authSessionLogsService: AuthSessionLogsService) {}

  @Get()
  @ApiGetAllUsersSessionLogsDocs()
  @RequiredRoles([UserRoles.ADMIN])
  @HttpCode(HttpStatus.OK)
  public getAllUsers(@Query() query: GetAllUsersSessionLogsRequest): Promise<GetAllUsersSessionLogsResponse> {
    return this.authSessionLogsService.getAllUsers(query);
  }

  @Get('current')
  @ApiGetCurrentSessionLogDocs()
  @HttpCode(HttpStatus.OK)
  public getCurrent(@CurrentUser() user: UserModel, @CurrentSession() sessionId: string): Promise<AuthSessionLogModel> {
    return this.authSessionLogsService.getCurrent(user.id, sessionId);
  }

  @Get(':identifier')
  @ApiGetAllSessionLogsDocs()
  @RequiredRoles([{ param: 'identifier', exceptValues: ['me'], roles: [UserRoles.ADMIN] }])
  @HttpCode(HttpStatus.OK)
  public getAll(
    @Param('identifier') identifier: string,
    @Query() query: GetAllSessionLogsRequest,
    @CurrentUser() currentUser: UserModel,
  ): Promise<GetAllSessionLogsResponse> {
    const targetIsOwnUser = identifier.toLowerCase() === 'me';
    const userId = targetIsOwnUser ? currentUser.id : identifier;
    return this.authSessionLogsService.getAll(userId, query);
  }

  @Delete(':identifier/others')
  @ApiCloseOtherSessionsDocs()
  @RequiredRoles([{ param: 'identifier', exceptValues: ['me'], roles: [UserRoles.ADMIN] }])
  @HttpCode(HttpStatus.OK)
  public closeOthers(
    @Param('identifier') identifier: string,
    @CurrentUser() currentUser: UserModel,
    @CurrentSession() currentSessionId: string,
  ): Promise<CloseOtherSessionsResponse> {
    const targetIsOwnUser = identifier.toLowerCase() === 'me';
    const userId = targetIsOwnUser ? currentUser.id : identifier;
    const exceptSessionId = targetIsOwnUser ? currentSessionId : null;
    return this.authSessionLogsService.closeOthers(userId, exceptSessionId);
  }

  @Delete(':identifier/:sessionId')
  @ApiCloseSessionDocs()
  @RequiredRoles([{ param: 'identifier', exceptValues: ['me'], roles: [UserRoles.ADMIN] }])
  @HttpCode(HttpStatus.NO_CONTENT)
  public async closeOne(
    @Param('identifier') identifier: string,
    @Param('sessionId') sessionId: string,
    @CurrentUser() currentUser: UserModel,
  ): Promise<void> {
    const targetIsOwnUser = identifier.toLowerCase() === 'me';
    const userId = targetIsOwnUser ? currentUser.id : identifier;
    await this.authSessionLogsService.closeOne(userId, sessionId);
  }
}
