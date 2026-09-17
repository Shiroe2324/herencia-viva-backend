export const HEALTH_NOTIFICATIONS_DOCS = {
  SUMMARY: 'Stream job notifications',
  DESCRIPTION:
    'Provides a real-time SSE stream of BullMQ job lifecycle events for queued background work, including active, progress, completed, failed, stalled, and error notifications.',
  OPERATION_ID: 'streamJobNotifications',
  REQUEST: {
    NAME: 'GetJobStatusRequest',
    DESCRIPTION: 'Query parameters required to subscribe to a specific BullMQ job stream.',
    FIELDS: {
      QUEUE: 'BullMQ queue name that created the job.',
      JOB_ID: 'BullMQ job identifier to follow.',
    },
  },
  EVENTS: {
    ACTIVE: {
      NAME: 'HealthJobNotificationActiveEvent',
      DESCRIPTION: 'Event emitted when a BullMQ job becomes active and starts processing.',
      FIELDS: {
        TYPE: 'Discriminant field with value "active".',
        QUEUE: 'Queue that emitted the event.',
        JOB_ID: 'BullMQ job identifier being processed.',
        PREV: 'Previous BullMQ state before becoming active.',
      },
    },
    PROGRESS: {
      NAME: 'HealthJobNotificationProgressEvent',
      DESCRIPTION: 'Event emitted when a BullMQ job reports progress.',
      FIELDS: {
        TYPE: 'Discriminant field with value "progress".',
        QUEUE: 'Queue that emitted the event.',
        JOB_ID: 'BullMQ job identifier being processed.',
        PROGRESS: 'Progress payload reported by the worker.',
      },
    },
    COMPLETED: {
      NAME: 'HealthJobNotificationCompletedEvent',
      DESCRIPTION: 'Event emitted when a BullMQ job completes successfully.',
      FIELDS: {
        TYPE: 'Discriminant field with value "completed".',
        QUEUE: 'Queue that emitted the event.',
        JOB_ID: 'BullMQ job identifier that completed.',
        RESULT: 'Optional return value produced by the worker.',
      },
    },
    FAILED: {
      NAME: 'HealthJobNotificationFailedEvent',
      DESCRIPTION: 'Event emitted when a BullMQ job fails.',
      FIELDS: {
        TYPE: 'Discriminant field with value "failed".',
        QUEUE: 'Queue that emitted the event.',
        JOB_ID: 'BullMQ job identifier that failed.',
        FAILED_REASON: 'Reason reported by BullMQ for the failure.',
      },
    },
    STALLED: {
      NAME: 'HealthJobNotificationStalledEvent',
      DESCRIPTION: 'Event emitted when a BullMQ job is stalled while waiting for processing.',
      FIELDS: {
        TYPE: 'Discriminant field with value "stalled".',
        QUEUE: 'Queue that emitted the event.',
        JOB_ID: 'BullMQ job identifier that stalled.',
      },
    },
    ERROR: {
      NAME: 'HealthJobNotificationErrorEvent',
      DESCRIPTION: 'Event emitted when an error occurs in the health notification system.',
      FIELDS: {
        TYPE: 'Discriminant field with value "error".',
        QUEUE: 'Queue that emitted the event.',
        JOB_ID: 'BullMQ job identifier related to the error when available.',
        MESSAGE: 'Error message describing what went wrong.',
      },
    },
  },
  RESULTS: {
    UNAUTHORIZED: 'Authentication token is missing or invalid.',
    UNPROCESSABLE_ENTITY: 'Query parameters failed validation.',
  },
  EVENT_FLOW:
    'Stream sequence: active or progress events may appear multiple times, followed by completed, failed, stalled, or error events depending on job outcome.',
} as const;
