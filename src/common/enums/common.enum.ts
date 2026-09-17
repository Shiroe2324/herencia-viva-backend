export enum NodeEnv {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
  PROVISION = 'provision',
}

export enum LanguageCodes {
  EN = 'en',
  ES = 'es',
}

export enum EmailTypes {
  VERIFICATION = 'verification',
  RESET_PASSWORD = 'reset_password',
  RECOVER_ACCOUNT = 'recover_account',
}

export enum GetAllOrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum PictureQueueTypes {
  USER = 'user',
}

export enum FileOrigins {
  LOCAL = 'local',
  EXTERNAL = 'external',
}

export enum HealthJobNotificationEventTypes {
  ACTIVE = 'active',
  PROGRESS = 'progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  STALLED = 'stalled',
  ERROR = 'error',
}
