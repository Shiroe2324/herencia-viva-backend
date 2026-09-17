export const AUTH_APPLE_TAG = {
  NAME: 'Authentication / Apple',
  DESCRIPTION:
    'Apple OAuth 2.0 integration for seamless authentication. Supports both web-based redirect flow and mobile/external client authentication using Apple identity tokens. Automatically creates accounts for new users.',
};

export const AUTH_GOOGLE_TAG = {
  NAME: 'Authentication / Google',
  DESCRIPTION:
    'Google OAuth 2.0 integration for seamless authentication. Supports both web-based redirect flow and mobile/external client authentication using Google ID tokens. Automatically creates accounts for new users.',
};

export const AUTH_MFA_TAG = {
  NAME: 'Authentication / MFA',
  DESCRIPTION:
    'Multi-Factor Authentication (2FA) using Time-based One-Time Passwords (TOTP). Includes setup with QR codes, token validation during login, backup code generation for account recovery, and MFA enable/disable operations.',
} as const;

export const AUTH_PASSWORD_TAG = {
  NAME: 'Authentication / Password',
  DESCRIPTION:
    'Comprehensive password management including secure password updates for authenticated users, initial password setup for OAuth users, forgot password flow with email verification, and password reset using secure tokens.',
} as const;

export const AUTH_REGISTRATION_TAG = {
  NAME: 'Authentication / Registration',
  DESCRIPTION:
    'New user onboarding and account activation. Handles account creation with email/password credentials, email verification through secure tokens, and user identity confirmation workflows.',
} as const;

export const AUTH_SESSION_LOGS_TAG = {
  NAME: 'Authentication / Session Logs',
  DESCRIPTION:
    'Login activity auditing and active session management. Lists paginated login attempts (successful and failed) with IP, location, and device metadata, exposes the session tied to the current access token, and allows closing every other active session for the account.',
} as const;

export const AUTH_SESSION_TAG = {
  NAME: 'Authentication / Session',
  DESCRIPTION:
    'Essential authentication operations including user login with credentials, session termination, and JWT token lifecycle management. Handles access token refresh and session validation.',
} as const;

export const RECOMMENDATIONS_LLM_TAG = {
  NAME: 'Recommendations / LLM',
  DESCRIPTION:
    'Retrieval-augmented chatbot recommendations powered by ChromaDB and Gemini. It indexes the JSONL knowledge base and returns contextual agricultural suggestions grounded in the dataset.',
} as const;

export const RECOMMENDATIONS_CHATS_TAG = {
  NAME: 'Recommendations / Chats',
  DESCRIPTION:
    'CRUD operations for recommendation chat sessions. Allows authenticated users to list, inspect, rename, and delete their own persisted recommendation chats.',
} as const;

export const RECOMMENDATIONS_CONTEXTS_TAG = {
  NAME: 'Recommendations / Contexts',
  DESCRIPTION:
    'Administrative CRUD operations for recommendation contexts. Only administrators can manage the relational mirror and the vector database records that back AI retrieval.',
} as const;

export const USERS_CLIENTS_TAG = {
  NAME: 'Users / Clients',
  DESCRIPTION:
    'Core client management operations. Enables creating and updating client profile data such as phone, gender, and age for authenticated users.',
} as const;

export const HEALTH_CORE_TAG = {
  NAME: 'Health / Core',
  DESCRIPTION:
    'System health monitoring and status checks. Provides real-time information about application availability, database connectivity, external service dependencies, and overall system health metrics. Essential for monitoring, alerting, and load balancer health checks.',
} as const;

export const HEALTH_NOTIFICATIONS_TAG = {
  NAME: 'Health / Notifications',
  DESCRIPTION:
    'Real-time job notifications for asynchronous background work. Streams BullMQ lifecycle events so the frontend can react to queued jobs, progress updates, completions, failures, and queue errors.',
} as const;

export const USERS_CORE_TAG = {
  NAME: 'Users / Core',
  DESCRIPTION:
    'User profile and account management operations. Supports retrieving user lists with pagination and filtering, viewing detailed user profiles, updating profile information (username, display name), and permanent account deletion.',
} as const;

export const USERS_PICTURE_TAG = {
  NAME: 'Users / Pictures',
  DESCRIPTION:
    'Profile picture management with async processing. Handles image updates with automatic optimization and format conversion, picture updates with job tracking, and profile picture removal.',
} as const;

export const USERS_RECOVERY_TAG = {
  NAME: 'Users / Recovery',
  DESCRIPTION:
    'Account recovery system for deleted accounts. Allows users to restore recently deleted accounts through email verification, sends recovery instructions, and manages account restoration workflows.',
} as const;
