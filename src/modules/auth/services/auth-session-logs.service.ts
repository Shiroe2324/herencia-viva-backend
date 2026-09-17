import { Injectable, NotFoundException } from '@nestjs/common';

import {
  GetAllSessionLogsRequest,
  GetAllSessionLogsResponse,
  GetAllUsersSessionLogsRequest,
  GetAllUsersSessionLogsResponse,
} from '@/auth/dtos/session-logs';
import { AUTH_ERROR_CODES } from '@/constants';
import { AuthSessionLogModel, UserSessionLogsModel } from '@/models';
import { AuthSessionLogRepositoryService } from '@/repositories/services/auth-session-log.service';
import { AuthTokenRepositoryService } from '@/repositories/services/auth-token.service';
import { UserRepositoryService } from '@/repositories/services/user.service';

@Injectable()
export class AuthSessionLogsService {
  constructor(
    private readonly authSessionLogRepository: AuthSessionLogRepositoryService,
    private readonly authTokenRepository: AuthTokenRepositoryService,
    private readonly userRepository: UserRepositoryService,
  ) {}

  public async getAll(userId: string, data: GetAllSessionLogsRequest): Promise<GetAllSessionLogsResponse> {
    const { orderDirection, orderBy, page, limit, select } = data;

    const { data: sessionLogs, ...pagination } = await this.authSessionLogRepository.paginate({
      orderDirection,
      orderBy,
      page,
      limit,
      select,
      relationKeys: ['user'],
      filters: { user: { id: userId } },
    });

    return { sessionLogs, ...pagination };
  }

  public async getAllUsers(data: GetAllUsersSessionLogsRequest): Promise<GetAllUsersSessionLogsResponse> {
    const { orderDirection, orderBy, page, limit, select } = data;

    const { data: users, ...pagination } = await this.userRepository.paginate({
      orderDirection,
      orderBy,
      page,
      limit,
      select,
      relationKeys: ['roles', 'picture', 'sessionLogs'],
    });

    return { users: users.map((user) => new UserSessionLogsModel(user)), ...pagination };
  }

  public async getCurrent(userId: string, sessionId: string): Promise<AuthSessionLogModel> {
    const sessionLog = await this.authSessionLogRepository.findCurrent(userId, sessionId);
    if (!sessionLog) throw new NotFoundException(AUTH_ERROR_CODES.SESSION_LOG_NOT_FOUND);

    return sessionLog;
  }

  public async closeOthers(userId: string, exceptSessionId: string | null): Promise<{ closed: number }> {
    const closed = await this.authSessionLogRepository.closeAllExcept(userId, exceptSessionId);
    await this.authTokenRepository.blacklistAllExceptSession(userId, exceptSessionId);

    return { closed };
  }

  public async closeOne(userId: string, sessionId: string): Promise<void> {
    const sessionLog = await this.authSessionLogRepository.findCurrent(userId, sessionId);
    if (!sessionLog) throw new NotFoundException(AUTH_ERROR_CODES.SESSION_LOG_NOT_FOUND);

    await this.authSessionLogRepository.closeBySessionId(userId, sessionId);
    await this.authTokenRepository.blacklistBySession(userId, sessionId);
  }
}
