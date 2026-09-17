export const GOOGLE_LOGIN_DOCS = {
  SUMMARY: 'Initiate Google OAuth2 Login',
  DESCRIPTION: 'Redirects to Google authentication page to initiate OAuth2 sign-in flow',
  OPERATION_ID: 'googleLogin',
  RESULTS: {
    FOUND: 'The request was redirected to Google for authentication.',
  },
} as const;

export const GOOGLE_LOGIN_CALLBACK_DOCS = {
  SUMMARY: 'Google OAuth2 Callback Handler',
  DESCRIPTION: 'Handles the OAuth2 callback from Google after successful user authentication',
  OPERATION_ID: 'googleLoginCallback',
  RESULTS: {
    FOUND: 'The request was redirected to the application with authentication tokens.',
    UNAUTHORIZED: 'Google authentication failed or external user data is invalid.',
    FORBIDDEN: 'The Google account did not provide the required email information.',
    CONFLICT: 'The email is already registered with another authentication method.',
    SERVICE_UNAVAILABLE: 'The authentication process could not be completed due to a server-side error.',
  },
} as const;

export const GOOGLE_EXTERNAL_LOGIN_DOCS = {
  SUMMARY: 'Google OAuth2 Mobile/External Login',
  DESCRIPTION: 'Authenticates or registers users via Google OAuth2 for mobile apps and external clients',
  OPERATION_ID: 'googleExternalLogin',
  REQUEST: {
    NAME: 'GoogleExternalLoginRequest',
    DESCRIPTION: 'Contains Google ID token for authentication verification',
    FIELDS: {
      TOKEN: 'Google OAuth2 ID token received from the Google SDK',
    },
  },
  RESPONSE: {
    NAME: 'GoogleAuthenticationResponse',
    DESCRIPTION: 'JWT tokens issued after successful Google authentication',
    FIELDS: {
      ACCESS_TOKEN: 'JWT access token for accessing protected API resources',
      REFRESH_TOKEN: 'JWT refresh token for obtaining new access tokens when the current one expires',
      ACCESS_EXPIRES_IN: 'Access token expiration duration in seconds',
      REFRESH_EXPIRES_IN: 'Refresh token expiration duration in seconds',
    },
  },
  RESULTS: {
    OK: 'Authentication was completed successfully and tokens were issued.',
    UNAUTHORIZED: 'The Google token is invalid or expired.',
    FORBIDDEN: 'The Google account did not provide an email or account access is restricted.',
    CONFLICT: 'The email is already registered with a different authentication method.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
    SERVICE_UNAVAILABLE: 'The authentication process could not be completed due to a server-side error.',
  },
} as const;
