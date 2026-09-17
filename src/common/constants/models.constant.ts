export const AUTH_TOKEN_DOCS = {
  NAME: 'AuthToken',
  DESCRIPTION: 'Represents an authentication token used for user sessions and security flows',
  COMMENT: 'Entity that persists authentication tokens and their lifecycle state',
  FIELDS: {
    ID: 'Unique auth token identifier (UUID format)',
    CONTENT: 'Encrypted token content stored in the database',
    HASH: 'Deterministic hash for fast token lookup and validation',
    TYPE: 'Authentication token type (ACCESS, REFRESH, EMAIL_VERIFICATION, etc.)',
    SESSION_ID: 'Stable session identifier shared by an access/refresh token pair, preserved across refresh rotations',
    EXPIRATION_DATE: 'ISO 8601 timestamp when the token expires',
    IS_BLACKLISTED: 'Whether the token has been blacklisted and can no longer be used',
    CREATED_AT: 'ISO 8601 timestamp of token creation',
    UPDATED_AT: 'ISO 8601 timestamp of last token update',
    DELETED_AT: 'ISO 8601 timestamp of soft deletion (null if active)',
  },
} as const;

export const AUTH_SESSION_LOG_DOCS = {
  NAME: 'AuthSessionLog',
  DESCRIPTION: 'Represents a login attempt (successful or failed) recorded for auditing and session management',
  COMMENT: 'Entity that persists login attempts with client/network metadata and session lifecycle state',
  FIELDS: {
    ID: 'Unique session log identifier (UUID format)',
    SESSION_ID: 'Stable session identifier shared with the access/refresh token pair created on a successful login',
    STATUS: 'Outcome of the login attempt (SUCCESS or FAILED)',
    FAILURE_REASON: 'Reason the login attempt failed (null when the attempt succeeded)',
    IP_ADDRESS: 'IP address the login attempt originated from',
    USER_AGENT: 'Raw User-Agent header sent by the client',
    BROWSER: 'Browser parsed from the User-Agent header',
    OS: 'Operating system parsed from the User-Agent header',
    DEVICE_TYPE: 'Device type parsed from the User-Agent header (mobile, tablet, desktop, etc.)',
    COUNTRY: 'Country resolved from the IP address',
    CITY: 'City resolved from the IP address',
    USER: 'User account this login attempt is associated with',
    REVOKED_AT: 'ISO 8601 timestamp when this session was closed (null while active)',
    CREATED_AT: 'ISO 8601 timestamp of the login attempt',
    UPDATED_AT: 'ISO 8601 timestamp of last update to this log',
    DELETED_AT: 'ISO 8601 timestamp of soft deletion (null if active)',
  },
} as const;

export const RECOMMENDATION_CONTEXT_DOCS = {
  NAME: 'RecommendationContext',
  DESCRIPTION: 'Represents a recommendation context mirrored from the vector database for fast relational access',
  COMMENT: 'Entity that stores recommendation knowledge base entries for administrative management of the vector database',
  FIELDS: {
    ID: 'Unique recommendation context identifier (UUID format)',
    QUESTION: 'Context question used to build the vector search record',
    ANSWER: 'Context answer associated with the question',
    TAGS: 'Optional tags for categorizing or filtering recommendation contexts',
    CREATED_AT: 'ISO 8601 timestamp of context creation',
    UPDATED_AT: 'ISO 8601 timestamp of last context update',
    DELETED_AT: 'ISO 8601 timestamp of soft deletion (null if active)',
  },
} as const;

export const RECOMMENDATION_CHAT_DOCS = {
  NAME: 'RecommendationChat',
  DESCRIPTION: 'Represents a persistent AI recommendation chat associated with a user',
  COMMENT: 'Entity that stores recommendation chat sessions and their conversation history',
  FIELDS: {
    ID: 'Unique recommendation chat identifier (UUID format)',
    TITLE: 'Optional title generated from the first user message',
    MESSAGES: 'Ordered list of persisted chat message entities between user and assistant',
    USER: 'User account that owns the recommendation chat session',
    CREATED_AT: 'ISO 8601 timestamp of chat creation',
    UPDATED_AT: 'ISO 8601 timestamp of last chat update',
    DELETED_AT: 'ISO 8601 timestamp of soft deletion (null if active)',
  },
} as const;

export const RECOMMENDATION_CHAT_MESSAGE_DOCS = {
  NAME: 'RecommendationChatMessage',
  DESCRIPTION: 'Represents a single message inside a recommendation chat session',
  COMMENT: 'Entity that stores each persisted message exchanged between user and assistant in recommendation chats',
  FIELDS: {
    ID: 'Unique recommendation chat message identifier (UUID format)',
    ROLE: 'Message author role in the conversation (user or model)',
    CONTENT: 'Message text content stored in the database',
    CHAT: 'Recommendation chat session that owns this message',
    CREATED_AT: 'ISO 8601 timestamp when the message was created',
    UPDATED_AT: 'ISO 8601 timestamp of last message update',
    DELETED_AT: 'ISO 8601 timestamp of soft deletion (null if active)',
  },
} as const;

export const USER_CLIENT_DOCS = {
  NAME: 'UserClient',
  DESCRIPTION: 'Represents a client profile associated with a user',
  COMMENT: 'Entity that links users with client-specific demographic profile data',
  FIELDS: {
    ID: 'Unique client identifier (UUID format)',
    PHONE: 'Client phone number in international format',
    GENDER: 'Client gender for profile demographics',
    AGE: 'Client age in years',
    CREATED_AT: 'ISO 8601 timestamp of client profile creation',
    UPDATED_AT: 'ISO 8601 timestamp of last client profile update',
    DELETED_AT: 'ISO 8601 timestamp of soft deletion (null if active)',
  },
} as const;

export const USER_PICTURE_DOCS = {
  NAME: 'UserPicture',
  DESCRIPTION: 'Represents a user profile picture or avatar image',
  COMMENT: 'Entity that stores user profile picture metadata and storage references',
  FIELDS: {
    ID: 'Unique picture identifier (UUID format)',
    KEY: 'Storage key or internal object path for the image',
    URL: 'Publicly accessible URL of the user profile image',
    ORIGIN: 'Source of the picture (oauth provider, local upload, etc.)',
    JOB_ID: 'Reference ID for image processing job used for asynchronous tracking',
    PROCESSING: 'Indicates whether the picture is still being processed',
    USER: 'User profile associated with this picture',
    CREATED_AT: 'ISO 8601 timestamp of picture upload',
    UPDATED_AT: 'ISO 8601 timestamp of last picture update',
    DELETED_AT: 'ISO 8601 timestamp of soft deletion (null if active)',
  },
} as const;

export const USER_MFA_DOCS = {
  NAME: 'UserMfa',
  DESCRIPTION: 'Represents user MFA security configuration and recovery credentials',
  COMMENT: 'Entity that stores MFA state, encrypted secrets, and backup codes for each user',
  FIELDS: {
    ID: 'Unique MFA profile identifier (UUID format)',
    ENABLED: 'Whether Multi-Factor Authentication is enabled for this account',
    SECRET: 'Encrypted secret used for MFA challenge generation',
    BACKUP_CODES: 'Array of hashed backup codes available for MFA recovery',
    BACKUP_CODES_GENERATED_AT: 'ISO 8601 timestamp when MFA backup codes were generated',
    USER: 'User account associated with this MFA profile',
    CREATED_AT: 'ISO 8601 timestamp of MFA profile creation',
    UPDATED_AT: 'ISO 8601 timestamp of last MFA profile update',
    DELETED_AT: 'ISO 8601 timestamp of soft deletion (null if active)',
  },
} as const;

export const USER_ROLE_DOCS = {
  NAME: 'UserRole',
  DESCRIPTION: 'Represents a role or permission level assigned to a user',
  COMMENT: 'Entity that stores role definitions assignable to users',
  FIELDS: {
    ID: 'Unique role identifier (UUID format)',
    NAME: 'Role name for permission and access level identification',
    CREATED_AT: 'ISO 8601 timestamp of role creation',
    UPDATED_AT: 'ISO 8601 timestamp of last role update',
    DELETED_AT: 'ISO 8601 timestamp of soft deletion (null if active)',
  },
} as const;

export const USER_TOKEN_DOCS = {
  NAME: 'UserToken',
  DESCRIPTION: 'Represents a generic user token for account-related actions',
  COMMENT: 'Entity that stores account-action tokens with verification and expiry data',
  FIELDS: {
    ID: 'Unique user token identifier (UUID format)',
    CONTENT: 'Encrypted token content stored in the database',
    HASH: 'Deterministic hash for token lookup and verification',
    TYPE: 'Token category for account actions (recover account, reset password, etc.)',
    EXPIRATION_DATE: 'ISO 8601 timestamp when the token expires',
    CREATED_AT: 'ISO 8601 timestamp of token creation',
    UPDATED_AT: 'ISO 8601 timestamp of last token update',
    DELETED_AT: 'ISO 8601 timestamp of soft deletion (null if active)',
  },
} as const;

export const USER_DOCS = {
  NAME: 'PublicUserProfile',
  DESCRIPTION: 'Publicly visible user profile information shown to other users',
  COMMENT: 'Entity that stores user account data and profile attributes',
  FIELDS: {
    ID: 'Unique user identifier (UUID format)',
    EXTERNAL_ID: 'External provider identifier when account is linked to third-party auth',
    USERNAME: 'Unique username for login and identification',
    DISPLAY_NAME: 'Public name displayed for other users',
    EMAIL: 'User email address associated with the account',
    PASSWORD: 'Hashed password stored for local authentication (null for OAuth-only users)',
    IS_EMAIL_VERIFIED: 'Whether the user has verified their email address',
    LAST_LOGIN_AT: 'ISO 8601 timestamp of the most recent login',
    ROLES: 'List of roles and permission levels assigned to the user',
    CLIENT: 'Client profile linked to this user account',
    PICTURE: 'User profile picture or avatar information',
    CREATED_AT: 'ISO 8601 timestamp of account creation',
    UPDATED_AT: 'ISO 8601 timestamp of last profile update',
    DELETED_AT: 'ISO 8601 timestamp of soft deletion (null if active)',
  },
} as const;

export const USER_ME_USER_DOCS = {
  NAME: 'CurrentUserProfile',
  DESCRIPTION: 'Complete profile information for the authenticated user (private fields included)',
  COMMENT: 'Entity projection for authenticated user private profile fields',
  FIELDS: {
    EMAIL: 'User email address (only visible to account owner)',
    LAST_LOGIN_AT: 'ISO 8601 timestamp of the most recent login (only visible to account owner)',
    MFA: 'Multi-Factor Authentication profile linked to this user account',
    UPDATED_AT: 'ISO 8601 timestamp of last profile update (only visible to account owner)',
  },
} as const;

export const USER_SESSION_LOGS_DOCS = {
  NAME: 'UserSessionLogs',
  DESCRIPTION: 'User profile information including associated session logs for auditing and management',
  COMMENT: 'Entity projection for user profile with session log details',
  FIELDS: {
    SESSION_LOGS: 'List of session logs associated with the user account',
  },
};
