import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { UserTokenEntity } from '@/database/entities/user-token.entity';
import type { UserTokenModel } from '@/models';
import { CoreService } from '@/repositories/services/core.service';
import { Mappers } from '@/utils';

@Injectable()
export class UserTokenRepositoryService extends CoreService<UserTokenEntity, UserTokenModel> {
  constructor(@InjectRepository(UserTokenEntity) private readonly userTokenRepository: Repository<UserTokenEntity>) {
    super(userTokenRepository, Mappers.UserToken);
  }

  public async findOneWithUser(where: FindOptionsWhere<UserTokenEntity>) {
    return this.userTokenRepository.findOne({ where, relations: { user: { roles: true, picture: true } } });
  }
}
