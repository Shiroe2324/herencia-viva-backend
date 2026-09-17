export enum AuthStrategies {
  APPLE = 'apple',
  GOOGLE = 'google',
  JWT = 'jwt',
}

export enum AuthTokens {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export enum MfaTypes {
  TOTP = 'totp',
  BACKUP = 'backup',
}

export enum AuthSessionLogStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum AuthSessionLogFailureReason {
  INVALID_PASSWORD = 'invalid_password',
  INVALID_MFA_TOKEN = 'invalid_mfa_token',
}
