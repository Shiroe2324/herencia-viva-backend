import type { UserRoles } from '@/enums';
import type { UserRoleModel } from '@/models';

export function matchRoles(requiredRoles: UserRoles[], userRoles: UserRoleModel[]): boolean {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  const userRoleNames = userRoles.map((role) => role.name);
  return requiredRoles.some((requiredRole) => userRoleNames.includes(requiredRole));
}
