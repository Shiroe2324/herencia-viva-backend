import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserPictureEntity } from '@/database/entities/user-picture.entity';
import type { UserPictureModel } from '@/models';
import { CoreService } from '@/repositories/services/core.service';
import { Mappers } from '@/utils';

@Injectable()
export class UserPictureRepositoryService extends CoreService<UserPictureEntity, UserPictureModel> {
  constructor(@InjectRepository(UserPictureEntity) private readonly userPictureRepository: Repository<UserPictureEntity>) {
    super(userPictureRepository, Mappers.UserPicture);
  }
}
