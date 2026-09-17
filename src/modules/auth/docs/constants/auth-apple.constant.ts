export const APPLE_LOGIN_DOCS = {
  SUMMARY: 'Initiate Apple OAuth2 Login',
  DESCRIPTION: 'Redirects to Apple authentication page to initiate OAuth2 sign-in flow',
  OPERATION_ID: 'appleLogin',
  RESULTS: {
    FOUND: 'The request was redirected to Apple for authentication.',
  },
} as const;

export const APPLE_LOGIN_CALLBACK_DOCS = {
  SUMMARY: 'Apple OAuth2 Callback Handler',
  DESCRIPTION: 'Handles the OAuth2 callback from Apple after successful user authentication',
  OPERATION_ID: 'appleLoginCallback',
  RESULTS: {
    FOUND: 'The request was redirected to the application with authentication tokens.',
    UNAUTHORIZED: 'Apple authentication failed or external user data is invalid.',
    FORBIDDEN: 'The Apple account did not provide the required email information.',
    CONFLICT: 'The email is already registered with another authentication method.',
    SERVICE_UNAVAILABLE: 'The authentication process could not be completed due to a server-side error.',
  },
} as const;

export const APPLE_EXTERNAL_LOGIN_DOCS = {
  SUMMARY: 'Apple OAuth2 Mobile/External Login',
  DESCRIPTION: 'Authenticates or registers users via Apple OAuth2 for mobile apps and external clients',
  OPERATION_ID: 'appleExternalLogin',
  REQUEST: {
    NAME: 'AppleExternalLoginRequest',
    DESCRIPTION: 'Contains Apple identity token for authentication verification',
    FIELDS: {
      TOKEN: 'Apple OAuth2 identity token received from the Apple SDK',
    },
  },
  RESPONSE: {
    NAME: 'AppleAuthenticationResponse',
    DESCRIPTION: 'JWT tokens issued after successful Apple authentication',
    FIELDS: {
      ACCESS_TOKEN: 'JWT access token for accessing protected API resources',
      REFRESH_TOKEN: 'JWT refresh token for obtaining new access tokens when the current one expires',
      ACCESS_EXPIRES_IN: 'Access token expiration duration in seconds',
      REFRESH_EXPIRES_IN: 'Refresh token expiration duration in seconds',
    },
  },
  RESULTS: {
    OK: 'Authentication was completed successfully and tokens were issued.',
    UNAUTHORIZED: 'The Apple token is invalid or expired.',
    FORBIDDEN: 'The Apple account did not provide an email or account access is restricted.',
    CONFLICT: 'The email is already registered with a different authentication method.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
    SERVICE_UNAVAILABLE: 'The authentication process could not be completed due to a server-side error.',
  },
} as const;
