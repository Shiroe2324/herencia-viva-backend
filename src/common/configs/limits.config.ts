import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ENV_VALIDATION_CONFIG } from '@/constants';
import type { LimitsConfig as ILimitsConfig } from '@/types';

const limitsSchema = Joi.object<ILimitsConfig>({
  MAX_DISK_USAGE_PERCENT: Joi.number().positive().min(0).max(100).default(50),
  MAX_MEMORY_HEAP_SIZE: Joi.number().positive().default(150),
  MAX_MEMORY_RSS_SIZE: Joi.number().positive().default(150),
  MAX_IMAGE_FILE_SIZE: Joi.number().positive().default(1),
  MAX_GET_ALL_SESSION_LOGS_LIMIT: Joi.number().positive().default(100),
  MAX_GET_ALL_CHATS_LIMIT: Joi.number().positive().default(100),
  MAX_GET_ALL_CONTEXTS_LIMIT: Joi.number().positive().default(100),
  MAX_GET_ALL_USERS_LIMIT: Joi.number().positive().default(100),
  MIN_CHAT_TITLE_LENGTH: Joi.number().positive().default(3),
  MIN_CONTEXT_QUESTION_LENGTH: Joi.number().positive().default(5),
  MIN_CONTEXT_ANSWER_LENGTH: Joi.number().positive().default(5),
  MIN_CONTEXT_TAG_LENGTH: Joi.number().positive().default(1),
  MIN_USER_CLIENT_AGE: Joi.number().positive().default(14),
  MIN_USER_DISPLAY_NAME_LENGTH: Joi.number().positive().default(3),
  MIN_USER_PASSWORD_LENGTH: Joi.number().positive().default(6),
  MIN_USER_PROMPT_CONTEXT_LIMIT: Joi.number().positive().default(1),
  MIN_USER_PROMPT_LENGTH: Joi.number().positive().default(5),
  MIN_USER_USERNAME_LENGTH: Joi.number().positive().default(3),
  MAX_CHAT_TITLE_LENGTH: Joi.number().min(Joi.ref('MIN_CHAT_TITLE_LENGTH')).default(120),
  MAX_CONTEXT_QUESTION_LENGTH: Joi.number().min(Joi.ref('MIN_CONTEXT_QUESTION_LENGTH')).default(1000),
  MAX_CONTEXT_ANSWER_LENGTH: Joi.number().min(Joi.ref('MIN_CONTEXT_ANSWER_LENGTH')).default(1000),
  MAX_CONTEXT_TAG_LENGTH: Joi.number().min(Joi.ref('MIN_CONTEXT_TAG_LENGTH')).default(50),
  MAX_USER_CLIENT_AGE: Joi.number().min(Joi.ref('MIN_USER_CLIENT_AGE')).default(120),
  MAX_USER_DISPLAY_NAME_LENGTH: Joi.number().min(Joi.ref('MIN_USER_DISPLAY_NAME_LENGTH')).default(50),
  MAX_USER_PASSWORD_LENGTH: Joi.number().min(Joi.ref('MIN_USER_PASSWORD_LENGTH')).default(36),
  MAX_USER_PROMPT_CONTEXT_LIMIT: Joi.number().min(Joi.ref('MIN_USER_PROMPT_CONTEXT_LIMIT')).default(10),
  MAX_USER_PROMPT_LENGTH: Joi.number().min(Joi.ref('MIN_USER_PROMPT_LENGTH')).default(1000),
  MAX_USER_USERNAME_LENGTH: Joi.number().min(Joi.ref('MIN_USER_USERNAME_LENGTH')).default(36),
});

const { value, error } = limitsSchema.validate(process.env, ENV_VALIDATION_CONFIG);
if (error) throw new Error(`Limits configuration validation error: ${error.message}`);

export const limitsConfig = registerAs('limits-config', () => ({
  maxDiskUsagePercent: value.MAX_DISK_USAGE_PERCENT / 100,
  maxMemoryHeapSize: value.MAX_MEMORY_HEAP_SIZE * 1024 * 1024,
  maxMemoryRssSize: value.MAX_MEMORY_RSS_SIZE * 1024 * 1024,
  maxImageFileSize: value.MAX_IMAGE_FILE_SIZE,
  maxGetAllSessionLogsLimit: value.MAX_GET_ALL_SESSION_LOGS_LIMIT,
  maxGetAllChatsLimit: value.MAX_GET_ALL_CHATS_LIMIT,
  maxGetAllContextsLimit: value.MAX_GET_ALL_CONTEXTS_LIMIT,
  maxGetAllUsersLimit: value.MAX_GET_ALL_USERS_LIMIT,
  minChatTitleLength: value.MIN_CHAT_TITLE_LENGTH,
  minContextQuestionLength: value.MIN_CONTEXT_QUESTION_LENGTH,
  minContextAnswerLength: value.MIN_CONTEXT_ANSWER_LENGTH,
  minContextTagLength: value.MIN_CONTEXT_TAG_LENGTH,
  minUserClientAge: value.MIN_USER_CLIENT_AGE,
  minUserDisplayNameLength: value.MIN_USER_DISPLAY_NAME_LENGTH,
  minUserPasswordLength: value.MIN_USER_PASSWORD_LENGTH,
  minUserPromptContextLimit: value.MIN_USER_PROMPT_CONTEXT_LIMIT,
  minUserPromptLength: value.MIN_USER_PROMPT_LENGTH,
  minUserUsernameLength: value.MIN_USER_USERNAME_LENGTH,
  maxChatTitleLength: value.MAX_CHAT_TITLE_LENGTH,
  maxContextQuestionLength: value.MAX_CONTEXT_QUESTION_LENGTH,
  maxContextAnswerLength: value.MAX_CONTEXT_ANSWER_LENGTH,
  maxContextTagLength: value.MAX_CONTEXT_TAG_LENGTH,
  maxUserClientAge: value.MAX_USER_CLIENT_AGE,
  maxUserDisplayNameLength: value.MAX_USER_DISPLAY_NAME_LENGTH,
  maxUserPasswordLength: value.MAX_USER_PASSWORD_LENGTH,
  maxUserPromptContextLimit: value.MAX_USER_PROMPT_CONTEXT_LIMIT,
  maxUserPromptLength: value.MAX_USER_PROMPT_LENGTH,
  maxUserUsernameLength: value.MAX_USER_USERNAME_LENGTH,
}));

export type LimitsConfig = ConfigType<typeof limitsConfig>;

export const MAX_IMAGE_FILE_SIZE = value.MAX_IMAGE_FILE_SIZE;
export const MAX_GET_ALL_SESSION_LOGS_LIMIT = value.MAX_GET_ALL_SESSION_LOGS_LIMIT;
export const MAX_GET_ALL_CHATS_LIMIT = value.MAX_GET_ALL_CHATS_LIMIT;
export const MAX_GET_ALL_CONTEXTS_LIMIT = value.MAX_GET_ALL_CONTEXTS_LIMIT;
export const MAX_GET_ALL_USERS_LIMIT = value.MAX_GET_ALL_USERS_LIMIT;
export const CHAT_TITLE_LENGTH_RANGE = {
  minLength: value.MIN_CHAT_TITLE_LENGTH,
  maxLength: value.MAX_CHAT_TITLE_LENGTH,
};
export const CONTEXT_QUESTION_LENGTH_RANGE = {
  minLength: value.MIN_CONTEXT_QUESTION_LENGTH,
  maxLength: value.MAX_CONTEXT_QUESTION_LENGTH,
};
export const CONTEXT_ANSWER_LENGTH_RANGE = {
  minLength: value.MIN_CONTEXT_ANSWER_LENGTH,
  maxLength: value.MAX_CONTEXT_ANSWER_LENGTH,
};
export const CONTEXT_TAG_LENGTH_RANGE = {
  minLength: value.MIN_CONTEXT_TAG_LENGTH,
  maxLength: value.MAX_CONTEXT_TAG_LENGTH,
};
export const USER_CLIENT_AGE_RANGE = { minimum: value.MIN_USER_CLIENT_AGE, maximum: value.MAX_USER_CLIENT_AGE };
export const USER_PROMPT_CONTEXT_LIMIT_RANGE = { minimum: value.MIN_USER_PROMPT_CONTEXT_LIMIT, maximum: value.MAX_USER_PROMPT_CONTEXT_LIMIT };
export const USER_PROMPT_LENGTH_RANGE = { minLength: value.MIN_USER_PROMPT_LENGTH, maxLength: value.MAX_USER_PROMPT_LENGTH };
export const USER_PASSWORD_LENGTH_RANGE = { minLength: value.MIN_USER_PASSWORD_LENGTH, maxLength: value.MAX_USER_PASSWORD_LENGTH };
export const USER_USERNAME_LENGTH_RANGE = { minLength: value.MIN_USER_USERNAME_LENGTH, maxLength: value.MAX_USER_USERNAME_LENGTH };
export const USER_DISPLAY_NAME_LENGTH_RANGE = { minLength: value.MIN_USER_DISPLAY_NAME_LENGTH, maxLength: value.MAX_USER_DISPLAY_NAME_LENGTH };
