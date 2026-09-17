import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserClientEntity } from '@/database/entities/user-client.entity';
import type { UserClientModel } from '@/models';
import { CoreService } from '@/repositories/services/core.service';
import { Mappers } from '@/utils';

@Injectable()
export class UserClientRepositoryService extends CoreService<UserClientEntity, UserClientModel> {
  constructor(@InjectRepository(UserClientEntity) private readonly userClientRepository: Repository<UserClientEntity>) {
    super(userClientRepository, Mappers.UserClient);
  }
}
