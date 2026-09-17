import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { USERS_CLIENTS_TAG } from '@/constants';
import { CurrentUser, Private, PrivateNoClientRequired, RequiredRoles } from '@/decorators';
import { UserRoles } from '@/enums';
import { UserClientModel, UserModel } from '@/models';
import { ApiCreateClientDocs, ApiGetClientDocs, ApiPatchClientDocs } from '@/users/docs/definitions/users-clients.doc';
import { CreateClientRequest, PatchClientRequest } from '@/users/dtos/clients';
import { UsersClientsService } from '@/users/services/users-clients.service';

@ApiTags(USERS_CLIENTS_TAG.NAME)
@Controller('users/clients')
export class UsersClientsController {
  constructor(private readonly usersClientsService: UsersClientsService) {}

  @Get(':identifier')
  @ApiGetClientDocs()
  @Private()
  @RequiredRoles([{ param: 'identifier', exceptValues: ['me'], roles: [UserRoles.ADMIN] }])
  @HttpCode(HttpStatus.OK)
  public getOne(@Param('identifier') identifier: string, @CurrentUser() currentUser: UserModel): Promise<UserClientModel> {
    const targetIsOwnUser = identifier.toLowerCase() === 'me';
    const ownUserClient = currentUser.client;
    if (targetIsOwnUser && ownUserClient) return Promise.resolve(ownUserClient);
    return this.usersClientsService.getOne(identifier);
  }

  @Post()
  @ApiCreateClientDocs()
  @PrivateNoClientRequired()
  @HttpCode(HttpStatus.OK)
  public createClient(@CurrentUser() user: UserModel, @Body() body: CreateClientRequest): Promise<UserClientModel> {
    return this.usersClientsService.createClient(user, body);
  }

  @Patch(':identifier')
  @ApiPatchClientDocs()
  @Private()
  @RequiredRoles([{ param: 'identifier', exceptValues: ['me'], roles: [UserRoles.ADMIN] }])
  @HttpCode(HttpStatus.OK)
  public async patch(
    @Param('identifier') identifier: string,
    @CurrentUser() currentUser: UserModel,
    @Body() body: PatchClientRequest,
  ): Promise<UserClientModel> {
    const targetIsOwnUser = identifier.toLowerCase() === 'me';
    const ownUserClient = currentUser.client;
    const client = targetIsOwnUser && ownUserClient ? ownUserClient : await this.usersClientsService.getOne(identifier);
    return this.usersClientsService.patch(client, body);
  }
}
