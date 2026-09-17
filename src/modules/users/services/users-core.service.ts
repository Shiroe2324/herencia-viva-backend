import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { validate as isUuid } from 'uuid';

import { USERS_ERROR_CODES } from '@/constants';
import type { UserModel } from '@/models';
import { UserRepositoryService } from '@/repositories/services/user.service';
import { GetAllUsersRequest, GetAllUsersResponse, PatchUserRequest } from '@/users/dtos/core';

@Injectable()
export class UsersCoreService {
  constructor(private readonly userRepository: UserRepositoryService) {}

  public async getAll(data: GetAllUsersRequest): Promise<GetAllUsersResponse> {
    const { orderDirection, orderBy, page, limit, select } = data;
    const relationKeys = ['roles', 'picture'];

    const { data: users, ...pagination } = await this.userRepository.paginate({ orderDirection, orderBy, page, limit, select, relationKeys });
    return { users, ...pagination };
  }

  public async getOne(identifier: string, withDeleted = false): Promise<UserModel> {
    const where = [];
    if (isUuid(identifier)) {
      where.push({ id: identifier });
    } else {
      where.push({ username: identifier }, { email: identifier });
    }

    const user = await this.userRepository.findOneWithDetails(where, withDeleted);
    if (!user) throw new NotFoundException(USERS_ERROR_CODES.USER_NOT_FOUND);

    return user;
  }

  public async patch(user: UserModel, data: PatchUserRequest): Promise<UserModel> {
    if (data.username && data.username !== user.username) {
      const isTaken = await this.userRepository.existsBy({ username: data.username });
      if (isTaken) throw new ConflictException(USERS_ERROR_CODES.USERNAME_ALREADY_IN_USE);
    }

    const changes = Object.keys(data).filter((key) => data[key as keyof PatchUserRequest] !== undefined);
    if (changes.length === 0) throw new ConflictException(USERS_ERROR_CODES.USER_NO_CHANGES);

    await this.userRepository.update({ id: user.id }, data);
    return Object.assign(user, data);
  }

  public async softDelete(user: UserModel): Promise<void> {
    await this.userRepository.softDelete({ id: user.id });
  }
}
