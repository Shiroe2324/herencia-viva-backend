export const UPDATE_USER_PICTURE_DOCS = {
  SUMMARY: 'Upload Profile Picture',
  DESCRIPTION: 'Uploads or updates the user profile picture',
  OPERATION_ID: 'updateUserPicture',
  PARAMS: {
    IDENTIFIER: 'User ID (UUID format), username, email, or "me" for current user',
  },
  REQUEST: {
    NAME: 'ProfilePictureUpdate',
    DESCRIPTION: 'Image file for the profile picture',
    FIELDS: {
      PICTURE: 'Image file (JPEG, PNG, GIF, or WEBP format)',
    },
  },
  RESPONSE: {
    NAME: 'PictureUpdateResponse',
    DESCRIPTION: 'Background job details for image processing',
    FIELDS: {
      JOB_ID: 'Background processing job identifier from queue system for tracking',
    },
  },
  RESULTS: {
    ACCEPTED: 'The profile picture update was queued for asynchronous processing.',
    NO_CONTENT: 'The profile picture was updated successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    BAD_REQUEST: 'The image file is missing or the multipart payload is invalid.',
    FORBIDDEN: 'You do not have permission to update this picture or it is currently being processed.',
    NOT_FOUND: 'The user was not found.',
  },
} as const;

export const DELETE_USER_PICTURE_DOCS = {
  SUMMARY: 'Delete Profile Picture',
  DESCRIPTION: 'Removes the user profile picture',
  OPERATION_ID: 'deleteUserPicture',
  PARAMS: {
    IDENTIFIER: 'User ID (UUID format), username, email, or "me" for current user',
  },
  RESPONSE: {
    NAME: 'PictureDeletionResponse',
    DESCRIPTION: 'Confirmation and background job details',
    FIELDS: {
      JOB_ID: 'Background processing job identifier from queue system for tracking',
    },
  },
  RESULTS: {
    ACCEPTED: 'The profile picture deletion was queued for asynchronous processing.',
    NO_CONTENT: 'The profile picture was deleted successfully.',
    UNAUTHORIZED: 'Authentication is required.',
    FORBIDDEN: 'You do not have permission to delete this picture or it is currently being processed.',
    NOT_FOUND: 'The user or profile picture was not found.',
  },
} as const;
