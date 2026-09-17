export const GET_ALL_CHATS_DOCS = {
  SUMMARY: 'List Recommendation Chats',
  DESCRIPTION: 'Retrieves a paginated list of recommendation chats that belong to the authenticated user.',
  OPERATION_ID: 'getAllRecommendationChats',
  REQUEST: {
    NAME: 'RecommendationChatListQueryParameters',
    DESCRIPTION: 'Pagination and sorting options for recommendation chats.',
    FIELDS: {
      ORDER_DIRECTION: 'Sorting direction (ASC or DESC).',
      ORDER_BY: 'Field used to sort chats (createdAt, updatedAt, or title).',
      PAGE: 'Page number for pagination (starts at 1).',
      LIMIT: 'Number of chats returned per page.',
    },
  },
  RESPONSE: {
    NAME: 'PaginatedRecommendationChatListResponse',
    DESCRIPTION: 'Paginated recommendation chat list with metadata.',
    FIELDS: {
      TOTAL: 'Total number of recommendation chats owned by the authenticated user.',
      PAGE: 'Current page number.',
      LIMIT: 'Number of chats per page.',
      TOTAL_PAGES: 'Total number of pages available.',
      CHATS: 'Array of recommendation chats.',
    },
  },
  CHAT: {
    NAME: 'RecommendationChatItem',
    DESCRIPTION: 'Represents a persisted recommendation chat conversation.',
    FIELDS: {
      ID: 'Unique chat identifier.',
      TITLE: 'Optional chat title saved for this conversation.',
      MESSAGES: 'Ordered messages stored in the chat.',
      CREATED_AT: 'Timestamp when the chat was created.',
      UPDATED_AT: 'Timestamp when the chat was last updated.',
    },
  },
  RESULTS: {
    OK: 'Recommendation chats were retrieved successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    UNPROCESSABLE_ENTITY: 'Query validation failed.',
  },
} as const;

export const GET_CHAT_DOCS = {
  SUMMARY: 'Get Recommendation Chat',
  DESCRIPTION: 'Retrieves a single recommendation chat by identifier when it belongs to the authenticated user.',
  OPERATION_ID: 'getRecommendationChat',
  PARAMS: {
    CHAT_ID: 'Recommendation chat identifier (UUID).',
  },
  RESULTS: {
    OK: 'Recommendation chat was retrieved successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    NOT_FOUND: 'The recommendation chat was not found.',
  },
} as const;

export const PATCH_CHAT_DOCS = {
  SUMMARY: 'Update Recommendation Chat',
  DESCRIPTION: 'Updates editable fields of a recommendation chat owned by the authenticated user.',
  OPERATION_ID: 'patchRecommendationChat',
  PARAMS: {
    CHAT_ID: 'Recommendation chat identifier (UUID).',
  },
  REQUEST: {
    NAME: 'PatchRecommendationChatRequest',
    DESCRIPTION: 'Editable fields of a recommendation chat.',
    FIELDS: {
      TITLE: 'New chat title within the configured length limits.',
    },
  },
  RESULTS: {
    OK: 'Recommendation chat was updated successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    NOT_FOUND: 'The recommendation chat was not found.',
    CONFLICT: 'No changes were provided for the recommendation chat.',
    UNPROCESSABLE_ENTITY: 'Request validation failed.',
  },
} as const;

export const DELETE_CHAT_DOCS = {
  SUMMARY: 'Delete Recommendation Chat',
  DESCRIPTION: 'Soft deletes a recommendation chat that belongs to the authenticated user.',
  OPERATION_ID: 'deleteRecommendationChat',
  PARAMS: {
    CHAT_ID: 'Recommendation chat identifier (UUID).',
  },
  RESULTS: {
    OK: 'Recommendation chat was deleted successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    NOT_FOUND: 'The recommendation chat was not found.',
  },
} as const;
