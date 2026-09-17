import { Reflector } from '@nestjs/core';

import type { UserRoles } from '@/enums';
import type { PrivateParamRoles } from '@/types';

export const RequiredRoles = Reflector.createDecorator<UserRoles[] | PrivateParamRoles[]>();
