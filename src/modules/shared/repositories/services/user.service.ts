import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { UserEntity } from '@/database/entities/user.entity';
import type { UserModel } from '@/models';
import { CoreService } from '@/repositories/services/core.service';
import { Mappers } from '@/utils';

@Injectable()
export class UserRepositoryService extends CoreService<UserEntity, UserModel> {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {
    super(userRepository, Mappers.User);
  }

  public findOneWithDetails(where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[], withDeleted = false): Promise<UserModel | null> {
    return this.userRepository.findOne({ where, relations: { roles: true, picture: true, client: true, mfa: true }, withDeleted });
  }

  public verifyUser(userId: string) {
    return this.userRepository.update({ id: userId }, { isEmailVerified: true });
  }

  public updatePicture(userId: string, pictureId: string | null) {
    return this.userRepository.update({ id: userId }, { picture: pictureId ? { id: pictureId } : null });
  }

  public async addRole(userId: string, roleId: string): Promise<void> {
    await this.repository.createQueryBuilder().relation(UserEntity, 'roles').of(userId).add(roleId);
  }

  public async removeRole(userId: string, roleId: string): Promise<void> {
    await this.repository.createQueryBuilder().relation(UserEntity, 'roles').of(userId).remove(roleId);
  }
}
