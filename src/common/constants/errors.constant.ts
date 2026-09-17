export const HTTP_ERROR_RESPONSE_DOCS = {
  NAME: 'StandardErrorResponse',
  DESCRIPTION: 'Standard error response format returned by all API endpoints on failure.',
  FIELDS: {
    STATUS_CODE: 'HTTP status code indicating the type of error.',
    ERROR: 'Human-readable error type or category name.',
    CODE: 'Machine-readable application-specific error code for error handling.',
    MESSAGE: 'Detailed, user-friendly error description explaining what went wrong.',
    TIMESTAMP: 'ISO 8601 timestamp indicating when the error occurred.',
    PATH: 'API endpoint path that generated the error.',
  },
  EXAMPLES: {
    ERROR: 'Internal Server Error',
    CODE: 'INTERNAL_SERVER_ERROR',
    MESSAGE: 'An unexpected error occurred while processing your request.',
    PATH: '/users/123',
  },
} as const;

export const VALIDATION_ERROR_ITEM_DOCS = {
  NAME: 'ValidationErrorDetail',
  DESCRIPTION: 'Details of a single field that failed validation.',
  FIELDS: {
    FIELD: 'Name of the field that failed validation checks.',
    MESSAGE: 'Specific validation error message describing the requirement not met.',
  },
  EXAMPLES: {
    FIELD: 'email',
    MESSAGE: 'Email must be a valid email address.',
  },
} as const;

export const VALIDATION_ERROR_RESPONSE_DOCS = {
  NAME: 'ValidationErrorResponse',
  DESCRIPTION: 'Response containing one or more field validation errors with details for each.',
  FIELDS: {
    ERRORS: 'Array of validation error details for each field that failed.',
  },
  EXAMPLES: {
    ERROR: 'Unprocessable Entity',
    ERRORS: [
      { field: 'email', message: 'Email must be a valid email address.' },
      { field: 'password', message: 'Password must be at least 8 characters.' },
    ],
  },
} as const;

export const HTTP_ERROR_RESPONSES_DOCS = {
  BAD_REQUEST: {
    NAME: 'BadRequest400',
    DESCRIPTION: 'Request contains invalid syntax, malformed data, or violates constraints.',
    ERROR: 'Bad Request',
    MESSAGE: 'The request could not be understood due to invalid syntax or structure.',
  },
  UNAUTHORIZED: {
    NAME: 'Unauthorized401',
    DESCRIPTION: 'Authentication is required but missing, invalid, or has expired.',
    ERROR: 'Unauthorized',
    MESSAGE: 'Authentication credentials are missing, invalid, or have expired.',
  },
  FORBIDDEN: {
    NAME: 'Forbidden403',
    DESCRIPTION: 'Request is valid but server refuses to fulfill it due to insufficient permissions.',
    ERROR: 'Forbidden',
    MESSAGE: 'You do not have permission to access this resource.',
  },
  NOT_FOUND: {
    NAME: 'NotFound404',
    DESCRIPTION: 'The requested resource does not exist or could not be located.',
    ERROR: 'Not Found',
    MESSAGE: 'The requested resource could not be found on the server.',
  },
  CONFLICT: {
    NAME: 'Conflict409',
    DESCRIPTION: 'Request conflicts with the current state of the resource on the server.',
    ERROR: 'Conflict',
    MESSAGE: 'The request conflicts with the current state of the resource.',
  },
  TOO_MANY_REQUESTS: {
    NAME: 'TooManyRequests429',
    DESCRIPTION: 'Client has exceeded the rate limit for API requests.',
    ERROR: 'Too Many Requests',
    MESSAGE: 'You have exceeded the rate limit. Please try again after some time.',
  },

  SERVICE_UNAVAILABLE: {
    NAME: 'ServiceUnavailable503',
    DESCRIPTION: 'Server is temporarily unavailable due to maintenance or overload.',
    ERROR: 'Service Unavailable',
    MESSAGE: 'The server is temporarily unavailable. Please try again later',
  },
} as const;
