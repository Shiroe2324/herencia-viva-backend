import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { USERS_ERROR_CODES } from '@/constants';
import { UserClientModel, UserModel } from '@/models';
import { UserClientRepositoryService } from '@/repositories/services/user-client.service';
import { CreateClientRequest, PatchClientRequest } from '@/users/dtos/clients';

@Injectable()
export class UsersClientsService {
  constructor(private readonly userClientRepository: UserClientRepositoryService) {}

  public async getOne(identifier: string): Promise<UserClientModel> {
    const client = await this.userClientRepository.findOneBy([{ id: identifier }, { user: { id: identifier } }]);
    if (!client) throw new NotFoundException(USERS_ERROR_CODES.CLIENT_NOT_FOUND);
    return client;
  }

  public async createClient(user: UserModel, data: CreateClientRequest): Promise<UserClientModel> {
    const { phone, gender, age } = data;

    const existingClient = await this.userClientRepository.findOneBy({ user: { id: user.id } });
    if (existingClient) throw new ConflictException(USERS_ERROR_CODES.CLIENT_ALREADY_EXISTS);

    return this.userClientRepository.create({ user, phone, gender, age });
  }

  public async patch(client: UserClientModel, data: PatchClientRequest): Promise<UserClientModel> {
    const toUpdate: Partial<UserClientModel> = {};

    if (data.phone && data.phone !== client.phone) toUpdate.phone = data.phone;
    if (data.gender && data.gender !== client.gender) toUpdate.gender = data.gender;
    if (data.age && data.age !== client.age) toUpdate.age = data.age;

    if (Object.keys(toUpdate).length === 0) {
      throw new ConflictException(USERS_ERROR_CODES.CLIENT_NO_CHANGES);
    }

    await this.userClientRepository.update({ id: client.id }, toUpdate);
    return Object.assign(client, toUpdate);
  }
}
