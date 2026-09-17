import type { AuthTokens } from '@/enums';
import type { UserModel } from '@/models/user.model';
import type { ModelRef } from '@/types';

export class AuthTokenModel {
  public id!: string;
  public content!: string;
  public hash!: string;
  public type!: AuthTokens;
  public sessionId!: string;
  public expirationDate!: Date;
  public isBlacklisted!: boolean;
  public user!: ModelRef<UserModel>;
  public associatedToken!: ModelRef<AuthTokenModel> | null;
  public inverseAssociatedToken!: ModelRef<AuthTokenModel> | null;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date | null;

  constructor(init?: Partial<AuthTokenModel>) {
    Object.assign(this, init);
  }
}
