import 'multer';

import type { UserModel } from '@/models';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserModel;
  }
}
