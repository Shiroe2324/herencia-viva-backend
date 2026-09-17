import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { DeepPartial } from 'typeorm';
import { IsNull, Not, Repository } from 'typeorm';

import { AuthSessionLogEntity } from '@/database/entities/auth-session-log.entity';
import { AuthSessionLogStatus } from '@/enums';
import type { AuthSessionLogModel } from '@/models';
import { CoreService } from '@/repositories/services/core.service';
import { Mappers } from '@/utils';

@Injectable()
export class AuthSessionLogRepositoryService extends CoreService<AuthSessionLogEntity, AuthSessionLogModel> {
  constructor(@InjectRepository(AuthSessionLogEntity) private readonly authSessionLogRepository: Repository<AuthSessionLogEntity>) {
    super(authSessionLogRepository, Mappers.AuthSessionLog);
  }

  public async createLog(data: DeepPartial<AuthSessionLogEntity>): Promise<AuthSessionLogModel> {
    const log = this.authSessionLogRepository.create(data);
    await this.authSessionLogRepository.save(log);
    return this.mapper.toModel(log);
  }

  public async findCurrent(userId: string, sessionId: string): Promise<AuthSessionLogModel | null> {
    const log = await this.authSessionLogRepository.findOne({
      where: { user: { id: userId }, sessionId, status: AuthSessionLogStatus.SUCCESS, revokedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    return log ? this.mapper.toModel(log) : null;
  }

  public async closeBySessionId(userId: string, sessionId: string): Promise<void> {
    await this.authSessionLogRepository.update(
      { user: { id: userId }, sessionId, status: AuthSessionLogStatus.SUCCESS, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  public async closeAllExcept(userId: string, exceptSessionId: string | null): Promise<number> {
    const result = await this.authSessionLogRepository.update(
      {
        user: { id: userId },
        ...(exceptSessionId ? { sessionId: Not(exceptSessionId) } : {}),
        status: AuthSessionLogStatus.SUCCESS,
        revokedAt: IsNull(),
      },
      { revokedAt: new Date() },
    );

    return result.affected ?? 0;
  }
}
