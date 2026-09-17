export const GET_ALL_USERS_DOCS = {
  SUMMARY: 'List All Users',
  DESCRIPTION: 'Retrieves a paginated list of all user accounts in the system',
  OPERATION_ID: 'getAllUsers',
  REQUEST: {
    NAME: 'UserListQueryParameters',
    DESCRIPTION: 'Pagination and sorting options',
    FIELDS: {
      ORDER_DIRECTION: 'Sorting direction (ASC or DESC)',
      ORDER_BY: 'Field to sort by (e.g., createdAt, username)',
      PAGE: 'Page number for pagination (starts at 1)',
      LIMIT: 'Number of results per page',
      SELECT:
        'Columns to include in response. Use repeated query keys (e.g., ?select=id&select=username). Nested relations (roles, picture) can be selected in full (e.g., ?select=picture) or by field (e.g., ?select=picture.url); a relation is only joined when it, or one of its fields, is selected. Defaults to all public columns.',
    },
  },
  RESPONSE: {
    NAME: 'PaginatedUserListResponse',
    DESCRIPTION: 'Paginated list of users with metadata',
    FIELDS: {
      TOTAL: 'Total number of users in the system',
      PAGE: 'Current page number',
      LIMIT: 'Number of users per page',
      TOTAL_PAGES: 'Total number of pages available',
      USERS: 'Array of user objects',
    },
  },
  RESULTS: {
    OK: 'The user list was retrieved successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    UNPROCESSABLE_ENTITY: 'The query parameters are invalid.',
  },
} as const;

export const GET_USER_DOCS = {
  SUMMARY: 'Get User Details',
  DESCRIPTION: 'Retrieves detailed information about a specific user or current user',
  OPERATION_ID: 'getUser',
  PARAMS: {
    IDENTIFIER: 'User ID (UUID format), username, email, or "me" for current user',
  },
  RESULTS: {
    OK: 'The user details were retrieved successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    NOT_FOUND: 'The user was not found.',
  },
} as const;

export const PATCH_USER_DOCS = {
  SUMMARY: 'Patch User Profile',
  DESCRIPTION: 'Modifies user profile information (username and display name)',
  OPERATION_ID: 'patchUser',
  PARAMS: {
    IDENTIFIER: 'User ID (UUID format), username, email, or "me" for current user',
  },
  REQUEST: {
    NAME: 'UserPatchRequest',
    DESCRIPTION: 'User profile fields to update',
    FIELDS: {
      USERNAME: 'New unique username for login',
      DISPLAY_NAME: 'New public display name shown to other users',
    },
  },
  RESULTS: {
    OK: 'The user profile was updated successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    FORBIDDEN: 'You do not have permission to update this profile.',
    NOT_FOUND: 'The user was not found.',
    CONFLICT: 'The username is already in use or no changes were provided.',
    UNPROCESSABLE_ENTITY: 'The request validation failed.',
  },
} as const;

export const DELETE_USER_DOCS = {
  SUMMARY: 'Delete User Account',
  DESCRIPTION: 'Soft deletes a user account (marks it as deleted without removing it from the database)',
  OPERATION_ID: 'deleteUser',
  PARAMS: {
    IDENTIFIER: 'User ID (UUID format), username, email, or "me" for current user',
  },
  RESULTS: {
    OK: 'The user account was soft deleted successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    FORBIDDEN: 'You do not have permission to delete this user.',
    NOT_FOUND: 'The user was not found.',
  },
} as const;
