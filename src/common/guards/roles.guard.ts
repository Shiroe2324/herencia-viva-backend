import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AUTH_ERROR_CODES } from '@/constants';
import { RequiredRoles } from '@/decorators';
import { matchRoles } from '@/utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  public canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();

    const requiredRoles = this.reflector.get(RequiredRoles, handler);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const singleRoles = requiredRoles.filter((role) => typeof role === 'string');
    const paramRoles = requiredRoles.filter((role) => typeof role !== 'string' && 'param' in role);

    const hasRole = matchRoles(singleRoles, request.user.roles);
    if (!hasRole) throw new ForbiddenException(AUTH_ERROR_CODES.ROLE_INSUFFICIENT);

    for (const { param, exceptValues, roles } of paramRoles) {
      if (!request.params[param] || exceptValues.includes(request.params[param])) continue;
      const hasRole = matchRoles(roles, request.user.roles);
      if (!hasRole) throw new ForbiddenException(AUTH_ERROR_CODES.ROLE_INSUFFICIENT);
    }

    return true;
  }
}
