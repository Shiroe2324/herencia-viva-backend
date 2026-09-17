import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserMfaEntity } from '@/database/entities/user-mfa.entity';
import type { UserMfaModel } from '@/models';
import { CoreService } from '@/repositories/services/core.service';
import { Mappers } from '@/utils';

@Injectable()
export class UserMfaRepositoryService extends CoreService<UserMfaEntity, UserMfaModel> {
  constructor(@InjectRepository(UserMfaEntity) private readonly userMfaRepository: Repository<UserMfaEntity>) {
    super(userMfaRepository, Mappers.UserMfa);
  }
}
