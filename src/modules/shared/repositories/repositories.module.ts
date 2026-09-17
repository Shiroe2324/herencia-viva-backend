import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthSessionLogEntity } from '@/database/entities/auth-session-log.entity';
import { AuthTokenEntity } from '@/database/entities/auth-token.entity';
import { RecommendationChatMessageEntity } from '@/database/entities/recommendation-chat-message.entity';
import { RecommendationChatEntity } from '@/database/entities/recommendation-chat.entity';
import { RecommendationContextEntity } from '@/database/entities/recommendation-context.entity';
import { UserClientEntity } from '@/database/entities/user-client.entity';
import { UserMfaEntity } from '@/database/entities/user-mfa.entity';
import { UserPictureEntity } from '@/database/entities/user-picture.entity';
import { UserRoleEntity } from '@/database/entities/user-role.entity';
import { UserTokenEntity } from '@/database/entities/user-token.entity';
import { UserEntity } from '@/database/entities/user.entity';
import { AuthSessionLogRepositoryService } from '@/repositories/services/auth-session-log.service';
import { AuthTokenRepositoryService } from '@/repositories/services/auth-token.service';
import { RecommendationChatMessageRepositoryService } from '@/repositories/services/recommendation-chat-message.service';
import { RecommendationChatRepositoryService } from '@/repositories/services/recommendation-chat.service';
import { RecommendationContextRepositoryService } from '@/repositories/services/recommendation-context.service';
import { UserClientRepositoryService } from '@/repositories/services/user-client.service';
import { UserMfaRepositoryService } from '@/repositories/services/user-mfa.service';
import { UserPictureRepositoryService } from '@/repositories/services/user-picture.service';
import { UserRoleRepositoryService } from '@/repositories/services/user-role.service';
import { UserTokenRepositoryService } from '@/repositories/services/user-token.service';
import { UserRepositoryService } from '@/repositories/services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthSessionLogEntity,
      AuthTokenEntity,
      RecommendationContextEntity,
      RecommendationChatEntity,
      RecommendationChatMessageEntity,
      UserClientEntity,
      UserMfaEntity,
      UserPictureEntity,
      UserRoleEntity,
      UserTokenEntity,
      UserEntity,
    ]),
  ],
  providers: [
    AuthSessionLogRepositoryService,
    AuthTokenRepositoryService,
    RecommendationContextRepositoryService,
    RecommendationChatRepositoryService,
    RecommendationChatMessageRepositoryService,
    UserClientRepositoryService,
    UserMfaRepositoryService,
    UserPictureRepositoryService,
    UserRoleRepositoryService,
    UserTokenRepositoryService,
    UserRepositoryService,
  ],
  exports: [
    AuthSessionLogRepositoryService,
    AuthTokenRepositoryService,
    RecommendationContextRepositoryService,
    RecommendationChatRepositoryService,
    RecommendationChatMessageRepositoryService,
    UserClientRepositoryService,
    UserMfaRepositoryService,
    UserPictureRepositoryService,
    UserRoleRepositoryService,
    UserTokenRepositoryService,
    UserRepositoryService,
  ],
})
export class RepositoriesModule {}
