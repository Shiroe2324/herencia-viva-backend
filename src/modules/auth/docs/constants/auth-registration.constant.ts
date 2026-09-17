export const REGISTER_DOCS = {
  SUMMARY: 'Create New User Account',
  DESCRIPTION: 'Registers a new user account with credentials and required client profile fields',
  OPERATION_ID: 'registerUser',
  REQUEST: {
    NAME: 'UserRegistrationRequest',
    DESCRIPTION: 'User information required for account creation',
    FIELDS: {
      EMAIL: 'Email address for account login and verification',
      PASSWORD: 'Account password (must meet security requirements)',
      USERNAME: 'Unique username for public identification',
      DISPLAY_NAME: 'Public display name shown to other users',
      PHONE: 'Client phone number in international format (E.164)',
      GENDER: 'Client gender for profile demographics',
      AGE: 'Client age in years',
    },
  },
  RESULTS: {
    NO_CONTENT: 'The account was created successfully.',
    CONFLICT: 'The email or username is already registered.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
    SERVICE_UNAVAILABLE: 'The account could not be created due to a server-side error.',
  },
} as const;

export const VERIFY_EMAIL_DOCS = {
  SUMMARY: 'Verify Email Address',
  DESCRIPTION: 'Confirms user email ownership by verifying the token sent via email',
  OPERATION_ID: 'verifyEmail',
  REQUEST: {
    NAME: 'EmailVerificationRequest',
    DESCRIPTION: 'Email verification token from the email link',
    FIELDS: {
      TOKEN: 'Email verification token sent to user email',
    },
  },
  RESULTS: {
    NO_CONTENT: 'The email was verified successfully.',
    FORBIDDEN: 'The verification token has expired.',
    NOT_FOUND: 'The verification token is invalid or was not found.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;
