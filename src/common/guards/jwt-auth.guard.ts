import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ReflectableDecorator } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

import { AUTH_ERROR_CODES } from '@/constants';
import { Private, PrivateNoClientRequired } from '@/decorators';
import { AuthStrategies } from '@/enums';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthStrategies.JWT) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  public canActivate(context: ExecutionContext) {
    const isPrivate = this.getMeta<boolean>(context, Private);
    const isPrivateNoClientRequired = this.getMeta<boolean>(context, PrivateNoClientRequired);
    if (!isPrivate && !isPrivateNoClientRequired) return true;
    return super.canActivate(context);
  }

  private isAuthenticatedUser(user: unknown): user is NonNullable<Request['user']> {
    return !!user && typeof user === 'object' && 'isEmailVerified' in user && 'client' in user;
  }

  private getMeta<T>(context: ExecutionContext, key: ReflectableDecorator<boolean, boolean>): T | undefined {
    return this.reflector.get<T>(key, context.getHandler()) ?? this.reflector.get<T>(key, context.getClass());
  }

  public handleRequest<TUser = Request['user']>(err: unknown, user: TUser, _info: unknown, context: ExecutionContext): TUser {
    const isPrivate = this.getMeta<boolean>(context, Private);
    const isPrivateNoClientRequired = this.getMeta<boolean>(context, PrivateNoClientRequired);

    if (!isPrivate && !isPrivateNoClientRequired) return user;

    if (err || !user) throw new UnauthorizedException(AUTH_ERROR_CODES.TOKEN_INVALID);
    if (!this.isAuthenticatedUser(user)) throw new UnauthorizedException(AUTH_ERROR_CODES.TOKEN_INVALID);
    if (!user.isEmailVerified) throw new UnauthorizedException(AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED);
    if (!isPrivateNoClientRequired && !user.client) throw new UnauthorizedException(AUTH_ERROR_CODES.CLIENT_NOT_FOUND);

    return user;
  }
}
