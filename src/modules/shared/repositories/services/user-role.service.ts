import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRoleEntity } from '@/database/entities/user-role.entity';
import type { UserRoleModel } from '@/models';
import { CoreService } from '@/repositories/services/core.service';
import { Mappers } from '@/utils';

@Injectable()
export class UserRoleRepositoryService extends CoreService<UserRoleEntity, UserRoleModel> {
  constructor(@InjectRepository(UserRoleEntity) private readonly userRoleRepository: Repository<UserRoleEntity>) {
    super(userRoleRepository, Mappers.UserRole);
  }
}
