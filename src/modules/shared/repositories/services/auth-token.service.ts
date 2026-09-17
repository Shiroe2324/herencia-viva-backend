import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, FindOptionsWhere, Not, Repository } from 'typeorm';

import { AUTH_ERROR_CODES } from '@/constants';
import { AuthTokenEntity } from '@/database/entities/auth-token.entity';
import type { AuthTokenModel } from '@/models';
import { CoreService } from '@/repositories/services/core.service';
import { Mappers } from '@/utils';

@Injectable()
export class AuthTokenRepositoryService extends CoreService<AuthTokenEntity, AuthTokenModel> {
  constructor(@InjectRepository(AuthTokenEntity) private readonly authTokenRepository: Repository<AuthTokenEntity>) {
    super(authTokenRepository, Mappers.AuthToken);
  }

  public async findOneWithAssociatedToken(where: FindOptionsWhere<AuthTokenEntity>, includeInverseToken = false) {
    const token = await this.authTokenRepository.findOne({
      where,
      relations: { associatedToken: true, inverseAssociatedToken: includeInverseToken },
    });

    return token ? this.mapper.toModel(token) : null;
  }

  public async findOneWithUser(where: FindOptionsWhere<AuthTokenEntity>) {
    const token = await this.authTokenRepository.findOne({ where, relations: { user: true } });
    return token ? this.mapper.toModel(token) : null;
  }

  public async linkTokens(token1Id: string, token2Id: string): Promise<void> {
    return this.transaction(async (manager: EntityManager) => {
      const tokenRepo = manager.getRepository(AuthTokenEntity);

      const [token1, token2] = await Promise.all([
        tokenRepo.findOne({ where: { id: token1Id }, lock: { mode: 'pessimistic_write' } }),
        tokenRepo.findOne({ where: { id: token2Id }, lock: { mode: 'pessimistic_write' } }),
      ]);

      if (!token1 || !token2) throw new NotFoundException(AUTH_ERROR_CODES.TOKEN_NOT_FOUND);
      if (token1.associatedToken) token1.associatedToken = await tokenRepo.findOne({ where: { id: token1.associatedToken.id } });
      if (token2.associatedToken) token2.associatedToken = await tokenRepo.findOne({ where: { id: token2.associatedToken.id } });
      if (token1.associatedToken || token2.associatedToken) throw new ConflictException(AUTH_ERROR_CODES.TOKENS_ALREADY_LINKED);

      token1.associatedToken = token2;
      token2.inverseAssociatedToken = token1;

      await tokenRepo.save([token1, token2]);
    });
  }

  public async blacklistWithAssociated(tokenId: string): Promise<{ tokenId: string; associatedTokenId?: string }> {
    return this.transaction(async (manager: EntityManager) => {
      const tokenRepo = manager.getRepository(AuthTokenEntity);
      const token = await tokenRepo.findOne({ where: { id: tokenId }, lock: { mode: 'pessimistic_write' } });

      if (!token) throw new NotFoundException(AUTH_ERROR_CODES.TOKEN_NOT_FOUND);
      if (token.associatedToken) token.associatedToken = await tokenRepo.findOne({ where: { id: token.associatedToken.id } });

      if (!token.associatedToken) {
        const inverseQuery = await tokenRepo.createQueryBuilder('token').where('token.associated_token_id = :id', { id: tokenId }).getOne();
        if (inverseQuery) token.inverseAssociatedToken = inverseQuery;
      }

      token.isBlacklisted = true;
      await tokenRepo.save(token);

      const associated = token.associatedToken ?? token.inverseAssociatedToken;

      if (associated && !associated.isBlacklisted) {
        const associatedWithLock = await tokenRepo.findOne({ where: { id: associated.id }, lock: { mode: 'pessimistic_write' } });
        if (associatedWithLock && !associatedWithLock.isBlacklisted) {
          associatedWithLock.isBlacklisted = true;
          await tokenRepo.save(associatedWithLock);
          return { tokenId: token.id, associatedTokenId: associatedWithLock.id };
        }
      }

      return { tokenId: token.id };
    });
  }

  public async blacklistByHash(hash: string): Promise<AuthTokenModel | null> {
    return this.transaction(async (manager: EntityManager) => {
      const tokenRepo = manager.getRepository(AuthTokenEntity);
      const token = await tokenRepo.findOne({ where: { hash, isBlacklisted: false }, lock: { mode: 'pessimistic_write' } });
      if (!token) return null;

      token.isBlacklisted = true;
      await tokenRepo.save(token);

      return this.mapper.toModel(token);
    });
  }

  public async blacklistAllExceptSession(userId: string, exceptSessionId: string | null): Promise<void> {
    await this.authTokenRepository.update(
      { user: { id: userId }, ...(exceptSessionId ? { sessionId: Not(exceptSessionId) } : {}), isBlacklisted: false },
      { isBlacklisted: true },
    );
  }

  public async blacklistBySession(userId: string, sessionId: string): Promise<void> {
    await this.authTokenRepository.update({ user: { id: userId }, sessionId, isBlacklisted: false }, { isBlacklisted: true });
  }

  public async createToken(data: DeepPartial<AuthTokenEntity>): Promise<AuthTokenModel> {
    return this.transaction(async (manager: EntityManager) => {
      const tokenRepo = manager.getRepository(AuthTokenEntity);
      const token = tokenRepo.create(data);
      await tokenRepo.save(token);
      return this.mapper.toModel(token);
    });
  }
}
