import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { USERS_CORE_TAG } from '@/constants';
import { CurrentUser, Private, RequiredRoles } from '@/decorators';
import { UserRoles } from '@/enums';
import { MeUserModel, UserModel } from '@/models';
import { ApiDeleteUserDocs, ApiGetAllUsersDocs, ApiGetUserDocs, ApiPatchUserDocs } from '@/users/docs/definitions/users-core.doc';
import { GetAllUsersRequest, GetAllUsersResponse, PatchUserRequest } from '@/users/dtos/core';
import { UsersCoreService } from '@/users/services/users-core.service';

@ApiTags(USERS_CORE_TAG.NAME)
@Controller('users')
@Private()
export class UsersCoreController {
  constructor(private readonly usersCoreService: UsersCoreService) {}

  @Get()
  @ApiGetAllUsersDocs()
  @HttpCode(HttpStatus.OK)
  public getAll(@Query() query: GetAllUsersRequest): Promise<GetAllUsersResponse> {
    return this.usersCoreService.getAll(query);
  }

  @Get(':identifier')
  @ApiGetUserDocs()
  @HttpCode(HttpStatus.OK)
  public async getOne(@Param('identifier') identifier: string, @CurrentUser() currentUser: UserModel): Promise<UserModel | MeUserModel> {
    const targetIsOwnUser = identifier.toLowerCase() === 'me';
    const user = targetIsOwnUser ? currentUser : await this.usersCoreService.getOne(identifier);
    return targetIsOwnUser ? new MeUserModel(user) : new UserModel(user);
  }

  @Patch(':identifier')
  @ApiPatchUserDocs()
  @RequiredRoles([{ param: 'identifier', exceptValues: ['me'], roles: [UserRoles.ADMIN] }])
  @HttpCode(HttpStatus.OK)
  public async patch(
    @Body() body: PatchUserRequest,
    @Param('identifier') identifier: string,
    @CurrentUser() currentUser: UserModel,
  ): Promise<UserModel | MeUserModel> {
    const targetIsOwnUser = identifier.toLowerCase() === 'me';
    const user = targetIsOwnUser ? currentUser : await this.usersCoreService.getOne(identifier);
    const updated = await this.usersCoreService.patch(user, body);
    return targetIsOwnUser ? new MeUserModel(updated) : new UserModel(updated);
  }

  @Delete(':identifier')
  @ApiDeleteUserDocs()
  @RequiredRoles([{ param: 'identifier', exceptValues: ['me'], roles: [UserRoles.ADMIN] }])
  @HttpCode(HttpStatus.OK)
  public async delete(@Param('identifier') identifier: string, @CurrentUser() currentUser: UserModel): Promise<UserModel | MeUserModel> {
    const targetIsOwnUser = identifier.toLowerCase() === 'me';
    const user = targetIsOwnUser ? currentUser : await this.usersCoreService.getOne(identifier);
    await this.usersCoreService.softDelete(user);
    return targetIsOwnUser ? new MeUserModel(user) : new UserModel(user);
  }
}
