export const RECOVER_ACCOUNT_DOCS = {
  SUMMARY: 'Restore Deleted Account',
  DESCRIPTION: 'Restores a previously deleted user account using a recovery token',
  OPERATION_ID: 'recoverAccount',
  REQUEST: {
    NAME: 'AccountRecoveryRequest',
    DESCRIPTION: 'Recovery token sent to the user email',
    FIELDS: {
      TOKEN: 'Account recovery token from email link',
    },
  },
  RESULTS: {
    NO_CONTENT: 'The account was restored successfully.',
    UNAUTHORIZED: 'The recovery token is invalid or expired.',
    NOT_FOUND: 'The user or recovery token was not found.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;

export const SEND_RECOVERY_EMAIL_DOCS = {
  SUMMARY: 'Send Account Recovery Email',
  DESCRIPTION: 'Sends account recovery instructions to a deleted user account',
  OPERATION_ID: 'sendRecoveryEmail',
  REQUEST: {
    NAME: 'SendRecoveryEmailRequest',
    DESCRIPTION: 'Identifier used to locate the deleted account',
    FIELDS: {
      IDENTIFIER: 'User ID (UUID format), username, or email address',
    },
  },
  RESULTS: {
    NO_CONTENT: 'The recovery email was sent successfully.',
    NOT_FOUND: 'The user was not found.',
    CONFLICT: 'A recovery request is already pending or the account is not deleted.',
  },
} as const;
