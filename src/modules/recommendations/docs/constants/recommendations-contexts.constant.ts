export const GET_ALL_RECOMMENDATION_CONTEXTS_DOCS = {
  SUMMARY: 'List Recommendation Contexts',
  DESCRIPTION: 'Retrieves a paginated list of recommendation contexts managed by administrators.',
  OPERATION_ID: 'getAllRecommendationContexts',
  REQUEST: {
    NAME: 'RecommendationContextListQueryParameters',
    DESCRIPTION: 'Pagination and sorting options for recommendation contexts.',
    FIELDS: {
      ORDER_DIRECTION: 'Sorting direction (ASC or DESC).',
      ORDER_BY: 'Field used to sort contexts (createdAt, updatedAt, question, or answer).',
      PAGE: 'Page number for pagination (starts at 1).',
      LIMIT: 'Number of contexts returned per page.',
    },
  },
  RESPONSE: {
    NAME: 'PaginatedRecommendationContextListResponse',
    DESCRIPTION: 'Paginated recommendation context list with metadata.',
    FIELDS: {
      TOTAL: 'Total number of recommendation contexts.',
      PAGE: 'Current page number.',
      LIMIT: 'Number of contexts per page.',
      TOTAL_PAGES: 'Total number of pages available.',
      CONTEXTS: 'Array of recommendation contexts.',
    },
  },
  RESULTS: {
    OK: 'Recommendation contexts were retrieved successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    FORBIDDEN: 'Administrator permissions are required.',
    UNPROCESSABLE_ENTITY: 'Query validation failed.',
  },
} as const;

export const GET_RECOMMENDATION_CONTEXT_DOCS = {
  SUMMARY: 'Get Recommendation Context',
  DESCRIPTION: 'Retrieves a single recommendation context by identifier.',
  OPERATION_ID: 'getRecommendationContext',
  PARAMS: {
    CONTEXT_ID: 'Recommendation context identifier (UUID).',
  },
  RESULTS: {
    OK: 'Recommendation context was retrieved successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    FORBIDDEN: 'Administrator permissions are required.',
    NOT_FOUND: 'The recommendation context was not found.',
  },
} as const;

export const CREATE_RECOMMENDATION_CONTEXT_DOCS = {
  SUMMARY: 'Create Recommendation Context',
  DESCRIPTION: 'Creates a recommendation context and synchronizes it into the vector database.',
  OPERATION_ID: 'createRecommendationContext',
  REQUEST: {
    NAME: 'CreateRecommendationContextRequest',
    DESCRIPTION: 'Payload used to create a recommendation context.',
    FIELDS: {
      QUESTION: 'Question text stored as context metadata.',
      ANSWER: 'Answer text stored as context metadata.',
      TAGS: 'Optional tags associated with the recommendation context for categorization and searchability.',
    },
  },
  RESULTS: {
    CREATED: 'Recommendation context was created successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    FORBIDDEN: 'Administrator permissions are required.',
    UNPROCESSABLE_ENTITY: 'Request body validation failed.',
  },
} as const;

export const PATCH_RECOMMENDATION_CONTEXT_DOCS = {
  SUMMARY: 'Update Recommendation Context',
  DESCRIPTION: 'Updates an existing recommendation context and re-synchronizes it in the vector database.',
  OPERATION_ID: 'patchRecommendationContext',
  PARAMS: {
    CONTEXT_ID: 'Recommendation context identifier (UUID).',
  },
  REQUEST: {
    NAME: 'UpdateRecommendationContextRequest',
    DESCRIPTION: 'Editable fields of an existing recommendation context.',
    FIELDS: {
      QUESTION: 'Updated question text stored as context metadata.',
      ANSWER: 'Updated answer text stored as context metadata.',
      TAGS: 'Updated optional tags associated with the recommendation context for categorization and searchability.',
    },
  },
  RESULTS: {
    OK: 'Recommendation context was updated successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    FORBIDDEN: 'Administrator permissions are required.',
    NOT_FOUND: 'The recommendation context was not found.',
    CONFLICT: 'No changes were provided for the recommendation context.',
    UNPROCESSABLE_ENTITY: 'Request body validation failed.',
  },
} as const;

export const DELETE_RECOMMENDATION_CONTEXT_DOCS = {
  SUMMARY: 'Delete Recommendation Context',
  DESCRIPTION: 'Soft deletes a recommendation context and removes its mirrored record from the vector database.',
  OPERATION_ID: 'deleteRecommendationContext',
  PARAMS: {
    CONTEXT_ID: 'Recommendation context identifier (UUID).',
  },
  RESULTS: {
    OK: 'Recommendation context was deleted successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    FORBIDDEN: 'Administrator permissions are required.',
    NOT_FOUND: 'The recommendation context was not found.',
  },
} as const;
