import type { Logger } from 'nestjs-pino';

import { UserRoles } from '@/enums';
import type { UserRoleRepositoryService } from '@/repositories/services/user-role.service';

export async function seedUserRoles(userRoleRepository: UserRoleRepositoryService, logger: Logger): Promise<void> {
  logger.debug('Seeding user roles...');

  const existingRoles = await userRoleRepository.findAll();
  const existingRoleNames = existingRoles.map((role) => role.name);
  const missingRoles = Object.values(UserRoles).filter((role) => !existingRoleNames.includes(role));

  if (missingRoles.length > 0) {
    await userRoleRepository.createMany(missingRoles.map((roleName) => ({ name: roleName })));
    logger.log(`Created ${missingRoles.length} roles: ${missingRoles.join(', ')}`);
  } else {
    logger.log('All user roles already exist');
  }
}
