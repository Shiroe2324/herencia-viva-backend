import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthStrategies } from '@/enums';

@Injectable()
export class AppleAuthGuard extends AuthGuard(AuthStrategies.APPLE) {}
