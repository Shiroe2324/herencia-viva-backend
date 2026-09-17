export const LOGIN_DOCS = {
  SUMMARY: 'User Login',
  DESCRIPTION: 'Authenticates a user with credentials and returns JWT tokens for session management',
  OPERATION_ID: 'login',
  LINKS: {
    VERIFY_MFA_LOGIN: 'Use this endpoint to complete MFA verification and finish login',
  },
  REQUEST: {
    NAME: 'LoginRequestBody',
    DESCRIPTION: 'User credentials for authentication',
    FIELDS: {
      IDENTIFIER: 'User email address or username',
      PASSWORD: 'User account password',
    },
  },
  RESPONSE: {
    NAME: 'SuccessfulLoginResponse',
    DESCRIPTION: 'JWT tokens and session information after successful authentication',
    FIELDS: {
      ACCESS_TOKEN: 'JWT access token for accessing protected API resources',
      REFRESH_TOKEN: 'JWT refresh token for obtaining new access tokens when expired',
      ACCESS_EXPIRES_IN: 'Access token expiration duration in seconds',
      REFRESH_EXPIRES_IN: 'Refresh token expiration duration in seconds',
    },
  },
  MFA_REQUIRED_RESPONSE: {
    NAME: 'MFAChallengeResponse',
    DESCRIPTION: 'Response indicating MFA verification is required to complete login',
    FIELDS: {
      MFA_REQUIRED: 'Boolean flag indicating MFA verification is needed',
      OTP_SESSION_ID: 'Temporary session identifier (UUID format) for MFA verification',
    },
  },
  RESULTS: {
    OK: 'Authentication was completed successfully and tokens were issued.',
    ACCEPTED: 'Credentials are valid, but MFA verification is required to complete login.',
    FORBIDDEN: 'Credentials are invalid or the account is disabled.',
    NOT_FOUND: 'No account was found for the provided identifier.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;

export const LOGOUT_DOCS = {
  SUMMARY: 'User Logout',
  DESCRIPTION: 'Invalidates the refresh token and ends the authenticated session',
  OPERATION_ID: 'logout',
  REQUEST: {
    NAME: 'LogoutRequestBody',
    DESCRIPTION: 'Token to revoke during logout',
    FIELDS: {
      TOKEN: 'Refresh token to invalidate and end the session',
    },
  },
  RESULTS: {
    NO_CONTENT: 'The session was terminated successfully.',
    UNAUTHORIZED: 'Authentication is required or the provided token is invalid.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;

export const REFRESH_DOCS = {
  SUMMARY: 'Refresh JWT Tokens',
  DESCRIPTION: 'Generates new access and refresh tokens using a valid refresh token',
  OPERATION_ID: 'refreshTokens',
  REQUEST: {
    NAME: 'TokenRefreshRequest',
    DESCRIPTION: 'Refresh token to exchange for new tokens',
    FIELDS: {
      TOKEN: 'Valid refresh token from a previous authentication',
    },
  },
  RESPONSE: {
    NAME: 'TokenRefreshResponse',
    DESCRIPTION: 'New JWT tokens for continued session access',
    FIELDS: {
      ACCESS_TOKEN: 'New JWT access token for API resource access',
      REFRESH_TOKEN: 'New JWT refresh token for future token refreshes',
      ACCESS_EXPIRES_IN: 'New access token expiration duration in seconds',
      REFRESH_EXPIRES_IN: 'New refresh token expiration duration in seconds',
    },
  },
  RESULTS: {
    OK: 'New tokens were issued successfully.',
    FORBIDDEN: 'The refresh token is invalid or expired.',
    NOT_FOUND: 'The user account was not found.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;
