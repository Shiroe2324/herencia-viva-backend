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
import {
  AuthSessionLogModel,
  AuthTokenModel,
  RecommendationChatMessageModel,
  RecommendationChatModel,
  RecommendationContextModel,
  UserClientModel,
  UserMfaModel,
  UserModel,
  UserPictureModel,
  UserRoleModel,
  UserTokenModel,
} from '@/models';
import type { Constructor, Mappable, RepositoryMapper } from '@/types';

function isMappable(value: unknown): value is Mappable {
  return typeof value === 'object' && value !== null && 'constructor' in value && typeof value.constructor === 'function';
}

class GenericMapper {
  static toEntity<M extends Record<string, unknown>, E>(model: M, entityClass: Constructor<E>): E {
    const entity = new entityClass() as Record<string, unknown>;

    for (const key in model) {
      const value = model[key];
      if (value === undefined) continue;

      if (Array.isArray(value)) {
        entity[key] = value.map((item) => {
          if (isMappable(item) && typeof item.constructor.toEntity === 'function') {
            return item.constructor.toEntity(item);
          }
          return item;
        });
      } else if (isMappable(value) && typeof value.constructor.toEntity === 'function') {
        entity[key] = value.constructor.toEntity(value);
      } else {
        entity[key] = value;
      }
    }

    return entity as E;
  }

  static toModel<E extends Record<string, unknown>, M>(entity: E, modelClass: Constructor<M>): M {
    const model = new modelClass() as Record<string, unknown>;

    for (const key in entity) {
      const value = entity[key];
      if (value === undefined) continue;

      if (Array.isArray(value)) {
        model[key] = value.map((item) => {
          if (isMappable(item) && typeof item.constructor.toModel === 'function') {
            return item.constructor.toModel(item);
          }
          return item;
        });
      } else if (isMappable(value) && typeof value.constructor.toModel === 'function') {
        model[key] = value.constructor.toModel(value);
      } else {
        model[key] = value;
      }
    }

    return model as M;
  }
}

function createMapper<M, E>(getModel: () => Constructor<M>, getEntity: () => Constructor<E>): RepositoryMapper<M, E> {
  return {
    toEntity: (model: M) => GenericMapper.toEntity(model as Record<string, unknown>, getEntity()),
    toModel: (entity: E) => GenericMapper.toModel(entity as Record<string, unknown>, getModel()),
  };
}
export const Mappers = {
  AuthSessionLog: createMapper(
    () => AuthSessionLogModel,
    () => AuthSessionLogEntity,
  ),
  AuthToken: createMapper(
    () => AuthTokenModel,
    () => AuthTokenEntity,
  ),
  RecommendationChatMessage: createMapper(
    () => RecommendationChatMessageModel,
    () => RecommendationChatMessageEntity,
  ),
  RecommendationChat: createMapper(
    () => RecommendationChatModel,
    () => RecommendationChatEntity,
  ),
  RecommendationContext: createMapper(
    () => RecommendationContextModel,
    () => RecommendationContextEntity,
  ),
  UserClient: createMapper(
    () => UserClientModel,
    () => UserClientEntity,
  ),
  UserMfa: createMapper(
    () => UserMfaModel,
    () => UserMfaEntity,
  ),
  UserPicture: createMapper(
    () => UserPictureModel,
    () => UserPictureEntity,
  ),
  UserRole: createMapper(
    () => UserRoleModel,
    () => UserRoleEntity,
  ),
  UserToken: createMapper(
    () => UserTokenModel,
    () => UserTokenEntity,
  ),
  User: createMapper(
    () => UserModel,
    () => UserEntity,
  ),
};
