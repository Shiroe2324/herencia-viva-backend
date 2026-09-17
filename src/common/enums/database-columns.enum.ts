type ColumnGroup = Record<string, string>;

type NestedColumns<Key extends string, Relation extends string, G extends ColumnGroup> = Record<Key, Relation> & {
  [P in keyof G as `${Key}_${string & P}`]: `${Relation}.${G[P]}`;
};

/** Prefixes a column group under a relation, producing the bare relation key plus one dotted entry per field (e.g. `picture` + `{URL: 'url'}` -> `PICTURE: 'picture'`, `PICTURE_URL: 'picture.url'`). */
function nestColumns<Key extends string, Relation extends string, G extends ColumnGroup>(
  key: Key,
  relation: Relation,
  group: G,
): NestedColumns<Key, Relation, G> {
  const nested: Record<string, string> = { [key]: relation };
  for (const subKey in group) {
    nested[`${key}_${subKey}`] = `${relation}.${group[subKey]}`;
  }
  return nested as NestedColumns<Key, Relation, G>;
}

export const AuthTokenColumns = {
  ID: 'id',
  CONTENT: 'content',
  HASH: 'hash',
  TYPE: 'type',
  EXPIRATION_DATE: 'expirationDate',
  IS_BLACKLISTED: 'isBlacklisted',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;
export type AuthTokenColumns = (typeof AuthTokenColumns)[keyof typeof AuthTokenColumns];

export const RecommendationChatColumns = {
  ID: 'id',
  TITLE: 'title',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;
export type RecommendationChatColumns = (typeof RecommendationChatColumns)[keyof typeof RecommendationChatColumns];

export const RecommendationContextColumns = {
  ID: 'id',
  QUESTION: 'question',
  ANSWER: 'answer',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;
export type RecommendationContextColumns = (typeof RecommendationContextColumns)[keyof typeof RecommendationContextColumns];

export const UserClientColumns = {
  ID: 'id',
  CITY: 'city',
  AGE_RANGE: 'ageRange',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;
export type UserClientColumns = (typeof UserClientColumns)[keyof typeof UserClientColumns];

export const UserMfaColumns = {
  ID: 'id',
  ENABLED: 'enabled',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;
export type UserMfaColumns = (typeof UserMfaColumns)[keyof typeof UserMfaColumns];

export const UserTokenColumns = {
  ID: 'id',
  CONTENT: 'content',
  HASH: 'hash',
  TYPE: 'type',
  EXPIRATION_DATE: 'expirationDate',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;
export type UserTokenColumns = (typeof UserTokenColumns)[keyof typeof UserTokenColumns];

export const UserRoleColumns = {
  ID: 'id',
  NAME: 'name',
} as const;
export type UserRoleColumns = (typeof UserRoleColumns)[keyof typeof UserRoleColumns];

export const UserPictureColumns = {
  ID: 'id',
  URL: 'url',
  JOB_ID: 'jobId',
  PROCESSING: 'processing',
  ORIGIN: 'origin',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;
export type UserPictureColumns = (typeof UserPictureColumns)[keyof typeof UserPictureColumns];

// Minimal user projection reused wherever a `user` relation is nested one level deep (session logs).
const USER_SUMMARY_COLUMNS = {
  ID: 'id',
  USERNAME: 'username',
  DISPLAY_NAME: 'displayName',
  IS_EMAIL_VERIFIED: 'isEmailVerified',
  CREATED_AT: 'createdAt',
} as const;

const AUTH_SESSION_LOG_BASE_COLUMNS = {
  ID: 'id',
  SESSION_ID: 'sessionId',
  STATUS: 'status',
  FAILURE_REASON: 'failureReason',
  IP_ADDRESS: 'ipAddress',
  COUNTRY: 'country',
  CITY: 'city',
  BROWSER: 'browser',
  OS: 'os',
  DEVICE_TYPE: 'deviceType',
  REVOKED_AT: 'revokedAt',
  CREATED_AT: 'createdAt',
} as const;

export const AuthSessionLogColumns = {
  ...AUTH_SESSION_LOG_BASE_COLUMNS,
  ...nestColumns('USER', 'user', USER_SUMMARY_COLUMNS),
} as const;
export type AuthSessionLogColumns = (typeof AuthSessionLogColumns)[keyof typeof AuthSessionLogColumns];

export const UserColumns = {
  ID: 'id',
  USERNAME: 'username',
  DISPLAY_NAME: 'displayName',
  IS_EMAIL_VERIFIED: 'isEmailVerified',
  LAST_LOGIN_AT: 'lastLoginAt',
  ...nestColumns('ROLES', 'roles', UserRoleColumns),
  ...nestColumns('PICTURE', 'picture', UserPictureColumns),
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  EMAIL: 'email',
} as const;
export type UserColumns = (typeof UserColumns)[keyof typeof UserColumns];

// Same selectable surface as UserColumns, plus each user's session logs.
export const UserSessionLogsColumns = {
  ...UserColumns,
  ...nestColumns('SESSION_LOGS', 'sessionLogs', AUTH_SESSION_LOG_BASE_COLUMNS),
} as const;
export type UserSessionLogsColumns = (typeof UserSessionLogsColumns)[keyof typeof UserSessionLogsColumns];
