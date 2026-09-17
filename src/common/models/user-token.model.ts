import type { UserTokens } from '@/enums';
import type { UserModel } from '@/models/user.model';
import type { ModelRef } from '@/types';

export class UserTokenModel {
  public id!: string;
  public content!: string;
  public hash!: string;
  public type!: UserTokens;
  public expirationDate!: Date;
  public user!: ModelRef<UserModel>;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date | null;

  constructor(init?: Partial<UserTokenModel>) {
    Object.assign(this, init);
  }
}
