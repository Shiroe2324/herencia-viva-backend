export const GENERATE_MFA_DOCS = {
  SUMMARY: 'Generate MFA Secret',
  DESCRIPTION: 'Creates a temporary TOTP (Time-based One-Time Password) secret for Multi-Factor Authentication setup',
  OPERATION_ID: 'generateMfa',
  RESPONSE: {
    NAME: 'MFASecretResponse',
    DESCRIPTION: 'TOTP secret key and QR code for authenticator app setup',
    FIELDS: {
      BASE32: 'Base32-encoded TOTP secret key for manual entry in authenticator apps',
      OTPAUTH_URL: 'OTPAuth URL (URI format) for direct import into authenticator applications',
      QR: 'QR code image (Base64-encoded) for authenticator app scanning',
    },
  },
  RESULTS: {
    OK: 'The MFA secret was generated successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    FORBIDDEN: 'A password must be set before enabling MFA.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;

export const ENABLE_MFA_DOCS = {
  SUMMARY: 'Enable Multi-Factor Authentication',
  DESCRIPTION: 'Activates MFA after verifying the TOTP token and credentials',
  OPERATION_ID: 'enableMfa',
  REQUEST: {
    NAME: 'EnableMFARequest',
    DESCRIPTION: 'Credentials and TOTP token required to verify and enable MFA',
    FIELDS: {
      PASSWORD: 'User account password for identity verification',
      TOKEN: 'TOTP code (6-digit) from authenticator application',
      BASE32: 'Temporary TOTP secret (Base32-encoded) from the generation step',
    },
  },
  RESPONSE: {
    NAME: 'MFAEnabledResponse',
    DESCRIPTION: 'Backup codes and confirmation after successful MFA activation',
    FIELDS: {
      BACKUP_CODES: 'Array of one-time backup codes for account recovery if authenticator device is lost',
    },
  },
  RESULTS: {
    OK: 'MFA was enabled successfully.',
    UNAUTHORIZED: 'Authentication is required or the password is incorrect.',
    FORBIDDEN: 'The TOTP token is invalid or password requirements are not met.',
    CONFLICT: 'MFA is already enabled for this account.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;

export const DISABLE_MFA_DOCS = {
  SUMMARY: 'Disable Multi-Factor Authentication',
  DESCRIPTION: 'Deactivates MFA for the user account after credential verification',
  OPERATION_ID: 'disableMfa',
  REQUEST: {
    NAME: 'DisableMFARequest',
    DESCRIPTION: 'Credentials required to disable MFA',
    FIELDS: {
      PASSWORD: 'User account password for identity verification',
      TOKEN: 'TOTP code (6-digit) from authenticator application',
    },
  },
  RESULTS: {
    OK: 'MFA was disabled successfully.',
    UNAUTHORIZED: 'Authentication is required or the password is incorrect.',
    FORBIDDEN: 'The TOTP token is invalid or password requirements are not met.',
    CONFLICT: 'MFA is not currently enabled for this account.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;

export const VALIDATE_MFA_LOGIN_DOCS = {
  SUMMARY: 'Verify MFA During Login',
  DESCRIPTION: 'Completes the login process by verifying the MFA token to establish authenticated session',
  OPERATION_ID: 'validateMfaLogin',
  REQUEST: {
    NAME: 'MFAVerificationRequest',
    DESCRIPTION: 'Session ID and TOTP token for login completion',
    FIELDS: {
      OTP_SESSION_ID: 'Temporary session ID (UUID format) received from initial login attempt',
      TOKEN: 'TOTP code (6-digit) from authenticator application',
    },
  },
  RESPONSE: {
    NAME: 'MFALoginSuccessResponse',
    DESCRIPTION: 'JWT tokens issued after successful MFA verification',
    FIELDS: {
      ACCESS_TOKEN: 'JWT access token for accessing protected API resources',
      REFRESH_TOKEN: 'JWT refresh token for obtaining new access tokens when expired',
      ACCESS_EXPIRES_IN: 'Access token expiration duration in seconds',
      REFRESH_EXPIRES_IN: 'Refresh token expiration duration in seconds',
      TYPE: 'MFA verification method used (TOTP, backup code, etc.)',
    },
  },
  RESULTS: {
    OK: 'MFA was verified successfully and authentication was completed.',
    UNAUTHORIZED: 'The session identifier is invalid or credentials are incorrect.',
    FORBIDDEN: 'The TOTP token is invalid or expired.',
    NOT_FOUND: 'The user associated with the MFA session was not found.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;

export const REGENERATE_MFA_BACKUP_CODES_DOCS = {
  SUMMARY: 'Regenerate MFA Backup Codes',
  DESCRIPTION: 'Generates new backup codes and invalidates all previous backup codes',
  OPERATION_ID: 'regenerateMfaBackupCodes',
  REQUEST: {
    NAME: 'RegenerateBackupCodesRequest',
    DESCRIPTION: 'Credentials required to regenerate backup codes',
    FIELDS: {
      PASSWORD: 'User account password for identity confirmation',
      TOKEN: 'TOTP code (6-digit) from authenticator application',
    },
  },
  RESPONSE: {
    NAME: 'NewBackupCodesResponse',
    DESCRIPTION: 'Newly generated backup codes for account recovery',
    FIELDS: {
      BACKUP_CODES: 'Array of new one-time backup codes',
    },
  },
  RESULTS: {
    OK: 'New MFA backup codes were generated successfully.',
    UNAUTHORIZED: 'Authentication is required or the password is incorrect.',
    FORBIDDEN: 'The TOTP token is invalid, password requirements are not met, or MFA is not enabled.',
    CONFLICT: 'Backup codes were regenerated recently; please wait before trying again.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;
