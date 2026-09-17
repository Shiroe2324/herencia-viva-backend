export const GET_CLIENT_DOCS = {
  SUMMARY: 'Get Client Details',
  DESCRIPTION: 'Retrieves client information for a specific client or current authenticated user',
  OPERATION_ID: 'getClient',
  PARAMS: {
    IDENTIFIER: 'Client ID (UUID format), user ID, or "me" for current user client',
  },
  RESULTS: {
    OK: 'The client details were retrieved successfully.',
    UNAUTHORIZED: 'Authentication is required or the token is invalid.',
    FORBIDDEN: 'You do not have permission to access this client.',
    NOT_FOUND: 'The client was not found.',
  },
} as const;

export const CREATE_CLIENT_DOCS = {
  SUMMARY: 'Create Client Profile',
  DESCRIPTION: 'Creates a client profile for authenticated users that still do not have one',
  OPERATION_ID: 'createClient',
  REQUEST: {
    NAME: 'CreateClientRequest',
    DESCRIPTION: 'Required client profile fields to complete onboarding',
    FIELDS: {
      PHONE: 'Client phone number in international format (E.164)',
      GENDER: 'Client gender for profile demographics',
      AGE: 'Client age in years',
    },
  },
  RESULTS: {
    OK: 'The client profile was created successfully.',
    UNAUTHORIZED: 'Authentication is required or the token is invalid.',
    FORBIDDEN: 'You do not have permission to create a client profile.',
    CONFLICT: 'A client profile already exists for this user.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;

export const PATCH_CLIENT_DOCS = {
  SUMMARY: 'Patch Client Information',
  DESCRIPTION: 'Partially updates client information',
  OPERATION_ID: 'patchClient',
  PARAMS: {
    IDENTIFIER: 'Client ID (UUID format), user ID, or "me" for current user client',
  },
  REQUEST: {
    NAME: 'PatchClientRequest',
    DESCRIPTION: 'Client fields to update',
    FIELDS: {
      PHONE: 'Client phone number in international format (E.164)',
      GENDER: 'Client gender for profile demographics',
      AGE: 'Client age in years',
    },
  },
  RESULTS: {
    OK: 'The client information was updated successfully.',
    UNAUTHORIZED: 'Authentication is required or the token is invalid.',
    FORBIDDEN: 'You do not have permission to update this client.',
    CONFLICT: 'No changes were provided.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;
