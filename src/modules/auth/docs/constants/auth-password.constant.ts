export const FORGOT_PASSWORD_DOCS = {
  SUMMARY: 'Request Password Reset Link',
  DESCRIPTION: 'Sends a password reset link to the user email address to initiate password recovery',
  OPERATION_ID: 'forgotPassword',
  REQUEST: {
    NAME: 'PasswordResetRequest',
    DESCRIPTION: 'Email address to receive the password reset link',
    FIELDS: {
      EMAIL: 'Email address associated with the user account',
    },
  },
  RESULTS: {
    NO_CONTENT: 'The password reset email was sent successfully.',
    FORBIDDEN: 'A pending reset request already exists or account access is restricted.',
    NOT_FOUND: 'No account was found for the provided email address.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;

export const RESET_PASSWORD_DOCS = {
  SUMMARY: 'Confirm Password Reset',
  DESCRIPTION: 'Sets a new password using a valid reset token sent via email',
  OPERATION_ID: 'resetPassword',
  REQUEST: {
    NAME: 'PasswordResetConfirmation',
    DESCRIPTION: 'Reset token and new password for account recovery',
    FIELDS: {
      TOKEN: 'Password reset token from the email link',
      NEW_PASSWORD: 'The new password to set for the account',
    },
  },
  RESULTS: {
    NO_CONTENT: 'The password was updated successfully.',
    FORBIDDEN: 'The reset token has expired.',
    NOT_FOUND: 'The reset token is invalid or was not found.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;

export const UPDATE_PASSWORD_DOCS = {
  SUMMARY: 'Change Account Password',
  DESCRIPTION: 'Updates the password for an authenticated user with MFA support',
  OPERATION_ID: 'updatePassword',
  REQUEST: {
    NAME: 'PasswordChangeRequest',
    DESCRIPTION: 'Current password and new password for authenticated user',
    FIELDS: {
      CURRENT_PASSWORD: 'Current account password for verification',
      NEW_PASSWORD: 'New password to set for the account',
      MFA_TOKEN: 'TOTP code (6-digit, required if MFA is enabled on account)',
    },
  },
  RESULTS: {
    NO_CONTENT: 'The password was changed successfully.',
    UNAUTHORIZED: 'Authentication is required or the current password is incorrect.',
    FORBIDDEN: 'OAuth users must set an initial password first.',
    CONFLICT: 'The new password must be different from the current password.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;

export const SET_PASSWORD_DOCS = {
  SUMMARY: 'Set Initial Password',
  DESCRIPTION: 'Creates a password for OAuth users who registered without a password',
  OPERATION_ID: 'setPassword',
  REQUEST: {
    NAME: 'SetPasswordRequest',
    DESCRIPTION: 'Initial password for OAuth users',
    FIELDS: {
      NEW_PASSWORD: 'The password to set for the account',
    },
  },
  RESULTS: {
    NO_CONTENT: 'The initial password was set successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    FORBIDDEN: 'Only OAuth users can use this endpoint to set an initial password.',
    CONFLICT: 'The user already has a password set.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;
