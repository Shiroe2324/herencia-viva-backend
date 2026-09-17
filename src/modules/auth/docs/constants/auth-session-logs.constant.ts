export const GET_ALL_SESSION_LOGS_DOCS = {
  SUMMARY: 'List Login Session Logs',
  DESCRIPTION: 'Retrieves a paginated list of login attempts (successful and failed) for a specific user or the current user',
  OPERATION_ID: 'getAllSessionLogs',
  PARAMS: {
    IDENTIFIER: 'User ID (UUID format) or "me" for the current user',
  },
  REQUEST: {
    NAME: 'SessionLogListQueryParameters',
    DESCRIPTION: 'Pagination and sorting options',
    FIELDS: {
      ORDER_DIRECTION: 'Sorting direction (ASC or DESC)',
      ORDER_BY: 'Field to sort by (e.g., createdAt, status)',
      PAGE: 'Page number for pagination (starts at 1)',
      LIMIT: 'Number of results per page',
      SELECT:
        'Columns to include in response. Use repeated query keys (e.g., ?select=id&select=status). The nested user can be selected in full (e.g., ?select=user) or by field (e.g., ?select=user.username); it is only joined when selected. Defaults to all columns.',
    },
  },
  RESPONSE: {
    NAME: 'PaginatedSessionLogListResponse',
    DESCRIPTION: 'Paginated list of login session logs with metadata',
    FIELDS: {
      TOTAL: 'Total number of session logs for this user',
      PAGE: 'Current page number',
      LIMIT: 'Number of session logs per page',
      TOTAL_PAGES: 'Total number of pages available',
      SESSION_LOGS: 'Array of login session log objects',
    },
  },
  RESULTS: {
    OK: 'The session log list was retrieved successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    FORBIDDEN: 'You do not have permission to view session logs for this user.',
    UNPROCESSABLE_ENTITY: 'The query parameters are invalid.',
  },
} as const;

export const GET_ALL_USERS_SESSION_LOGS_DOCS = {
  SUMMARY: 'List All Users With Session Logs',
  DESCRIPTION: 'Retrieves a paginated list of all users, each including their complete login session log history. Restricted to technical support',
  OPERATION_ID: 'getAllUsersSessionLogs',
  REQUEST: {
    NAME: 'UserSessionLogListQueryParameters',
    DESCRIPTION: 'Pagination and sorting options for the user list',
    FIELDS: {
      ORDER_DIRECTION: 'Sorting direction (ASC or DESC)',
      ORDER_BY: 'User field to sort by (e.g., username, createdAt)',
      PAGE: 'Page number for pagination (starts at 1)',
      LIMIT: 'Number of users per page',
      SELECT:
        'User columns to include in response. Use repeated query keys (e.g., ?select=id&select=username). Nested relations (roles, picture, sessionLogs) can be selected in full (e.g., ?select=picture) or by field (e.g., ?select=picture.url); a relation is only joined when it, or one of its fields, is selected. Defaults to all public columns.',
    },
  },
  RESPONSE: {
    NAME: 'PaginatedUserSessionLogListResponse',
    DESCRIPTION: 'Paginated list of users, each including all of their login session logs',
    FIELDS: {
      TOTAL: 'Total number of users',
      PAGE: 'Current page number',
      LIMIT: 'Number of users per page',
      TOTAL_PAGES: 'Total number of pages available',
      USERS: 'Array of users, each including all of their login session logs',
    },
  },
  RESULTS: {
    OK: 'The user list with session logs was retrieved successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    FORBIDDEN: 'You do not have permission to access this resource.',
    UNPROCESSABLE_ENTITY: 'The query parameters are invalid.',
  },
} as const;

export const GET_CURRENT_SESSION_LOG_DOCS = {
  SUMMARY: 'Get Current Session',
  DESCRIPTION: 'Retrieves the login session log tied to the access token used for this request',
  OPERATION_ID: 'getCurrentSessionLog',
  RESULTS: {
    OK: 'The current session was retrieved successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    NOT_FOUND: 'No active session log was found for the current token.',
  },
} as const;

export const CLOSE_OTHER_SESSIONS_DOCS = {
  SUMMARY: 'Close Other Sessions',
  DESCRIPTION:
    'Closes every other active login session for a user. For "me" this excludes the session tied to the current access token; for another user (admin only) every active session is closed, since the request carries no session of theirs to preserve',
  OPERATION_ID: 'closeOtherSessions',
  PARAMS: {
    IDENTIFIER: 'User ID (UUID format) or "me" for the current user',
  },
  RESPONSE: {
    NAME: 'CloseOtherSessionsResponse',
    DESCRIPTION: 'Result of closing other active sessions',
    FIELDS: {
      CLOSED: 'Number of sessions that were closed',
    },
  },
  RESULTS: {
    OK: 'The other active sessions were closed successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    FORBIDDEN: 'You do not have permission to close sessions for this user.',
  },
} as const;

export const CLOSE_SESSION_DOCS = {
  SUMMARY: 'Close Session',
  DESCRIPTION: 'Closes one specific active login session for a user and blacklists its tokens',
  OPERATION_ID: 'closeSession',
  PARAMS: {
    IDENTIFIER: 'User ID (UUID format) or "me" for the current user',
    SESSION_ID: 'Session ID to close, as returned in the "sessionId" field of a session log',
  },
  RESULTS: {
    OK: 'The session was closed successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    FORBIDDEN: 'You do not have permission to close sessions for this user.',
    NOT_FOUND: 'No active session was found with the given session ID for this user.',
  },
} as const;
