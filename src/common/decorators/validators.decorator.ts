import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import type { IsNumberOptions, ValidationOptions } from 'class-validator';
import {
  IsArray as BaseIsArray,
  IsEmail as BaseIsEmail,
  IsEnum as BaseIsEnum,
  IsInt as BaseIsInt,
  IsNotEmpty as BaseIsNotEmpty,
  IsNumber as BaseIsNumber,
  IsOptional as BaseIsOptional,
  IsPhoneNumber as BaseIsPhoneNumber,
  IsString as BaseIsString,
  IsUUID as BaseIsUUID,
  Length as BaseLength,
  Max as BaseMax,
  Min as BaseMin,
  Matches,
} from 'class-validator';
import type { CountryCode } from 'libphonenumber-js/max';
import { i18nValidationMessage } from 'nestjs-i18n';
import type { IsEmailOptions } from 'validator';

import {
  CHAT_TITLE_LENGTH_RANGE,
  CONTEXT_ANSWER_LENGTH_RANGE,
  CONTEXT_QUESTION_LENGTH_RANGE,
  CONTEXT_TAG_LENGTH_RANGE,
  MAX_GET_ALL_CHATS_LIMIT,
  MAX_GET_ALL_CONTEXTS_LIMIT,
  MAX_GET_ALL_SESSION_LOGS_LIMIT,
  MAX_GET_ALL_USERS_LIMIT,
  USER_CLIENT_AGE_RANGE,
  USER_DISPLAY_NAME_LENGTH_RANGE,
  USER_PASSWORD_LENGTH_RANGE,
  USER_PROMPT_CONTEXT_LIMIT_RANGE,
  USER_PROMPT_LENGTH_RANGE,
  USER_USERNAME_LENGTH_RANGE,
} from '@/configs';
import { ALPHANUMERIC_PATTERN, QUEUES } from '@/constants';
import { ClientGenders, GetAllOrderDirection } from '@/enums';
import type { EnumValidatorOptions, OptionalValidatorOptions, PhoneNumberValidatorOptions } from '@/types';

const { minimum: minUserClientAge, maximum: maxUserClientAge } = USER_CLIENT_AGE_RANGE;
const { minLength: minChatTitleLength, maxLength: maxChatTitleLength } = CHAT_TITLE_LENGTH_RANGE;
const { minLength: minContextQuestionLength, maxLength: maxContextQuestionLength } = CONTEXT_QUESTION_LENGTH_RANGE;
const { minLength: minContextAnswerLength, maxLength: maxContextAnswerLength } = CONTEXT_ANSWER_LENGTH_RANGE;
const { minLength: minContextTagLength, maxLength: maxContextTagLength } = CONTEXT_TAG_LENGTH_RANGE;
const { minLength: minUserPromptLength, maxLength: maxUserPromptLength } = USER_PROMPT_LENGTH_RANGE;
const { minimum: minUserPromptContextLimit, maximum: maxUserPromptContextLimit } = USER_PROMPT_CONTEXT_LIMIT_RANGE;
const { minLength: minUserPasswordLength, maxLength: maxUserPasswordLength } = USER_PASSWORD_LENGTH_RANGE;
const { minLength: minUserUsernameLength, maxLength: maxUserUsernameLength } = USER_USERNAME_LENGTH_RANGE;
const { minLength: minUserDisplayNameLength, maxLength: maxUserDisplayNameLength } = USER_DISPLAY_NAME_LENGTH_RANGE;

const toNumber = ({ value }: { value: unknown }) => (value !== null && value !== undefined ? Number(value) : value);

const toTrimmedString = (params: { value?: unknown } | undefined, lowercase = false) => {
  const value = params?.value;
  if (value === null || value === undefined) return undefined;
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return lowercase ? trimmed.toLowerCase() : trimmed;
};

const toNormalizedSelectValues = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null || value === '') return undefined;
  const values = Array.isArray(value) ? value : [value];
  return values.map((item) => String(item).trim()).filter(Boolean);
};

function Min(min: number, options?: ValidationOptions) {
  return BaseMin(min, { message: i18nValidationMessage('validations.MIN_NUMBER'), ...options });
}

function Max(max: number, options?: ValidationOptions) {
  return BaseMax(max, { message: i18nValidationMessage('validations.MAX_NUMBER'), ...options });
}

function Length(min: number, max: number, options?: ValidationOptions) {
  return BaseLength(min, max, { message: i18nValidationMessage('validations.LENGTH'), ...options });
}

function IsArray(options?: ValidationOptions) {
  return BaseIsArray({ message: i18nValidationMessage('validations.ARRAY'), ...options });
}

function IsInt(options?: ValidationOptions) {
  return BaseIsInt({ message: i18nValidationMessage('validations.INTEGER'), ...options });
}

function IsNumber(numberOptions?: IsNumberOptions, options?: ValidationOptions) {
  return BaseIsNumber(numberOptions, { message: i18nValidationMessage('validations.INTEGER'), ...options });
}

function IsAlphanumeric(options?: ValidationOptions) {
  return Matches(ALPHANUMERIC_PATTERN, { message: i18nValidationMessage('validations.ALPHANUMERIC'), ...options });
}

function IsPhoneNumber(region?: CountryCode, options?: ValidationOptions) {
  return BaseIsPhoneNumber(region ?? 'CO', { message: i18nValidationMessage('validations.PHONE_NUMBER'), ...options });
}

function IsRequiredString(lowercase = false) {
  return applyDecorators(
    IsNotEmpty(),
    IsString(),
    Transform((params) => toTrimmedString(params, lowercase)),
  );
}

function IsOptionalString(lowercase = false) {
  return applyDecorators(
    IsOptional(),
    IsString(),
    Transform((params) => toTrimmedString(params, lowercase)),
  );
}

function IsRequiredNumber() {
  return applyDecorators(IsNotEmpty(), IsNumber(), Transform(toNumber));
}

function IsOptionalNumber() {
  return applyDecorators(IsOptional(), IsNumber(), Transform(toNumber));
}

function IsRequiredInt() {
  return applyDecorators(IsNotEmpty(), IsInt(), Transform(toNumber));
}

function IsOptionalInt() {
  return applyDecorators(IsOptional(), IsInt(), Transform(toNumber));
}

function IsNotEmpty(options?: ValidationOptions) {
  return BaseIsNotEmpty({ message: i18nValidationMessage('validations.NOT_EMPTY'), ...options });
}

function IsString(options?: ValidationOptions) {
  return BaseIsString({ message: i18nValidationMessage('validations.STRING'), ...options });
}

function IsEmail(emailOptions?: IsEmailOptions, options?: ValidationOptions) {
  return BaseIsEmail(emailOptions, { message: i18nValidationMessage('validations.EMAIL'), ...options });
}

function IsEnum(enumType: object, options?: ValidationOptions) {
  return BaseIsEnum(enumType, { message: i18nValidationMessage('validations.ENUM'), ...options });
}

function IsUUID(options?: ValidationOptions) {
  return BaseIsUUID('all', { message: i18nValidationMessage('validations.UUID'), ...options });
}

function IsOptional(options?: ValidationOptions) {
  return BaseIsOptional(options);
}

function IsOptionalOrRequired(isOptional = false) {
  return isOptional ? IsOptional() : IsNotEmpty();
}

function IsStringByOptionality(isOptional = false, lowercase = false) {
  return isOptional ? IsOptionalString(lowercase) : IsRequiredString(lowercase);
}

function IsNumberByOptionality(isOptional = false) {
  return isOptional ? IsOptionalNumber() : IsRequiredNumber();
}

function IsIntByOptionality(isOptional = false) {
  return isOptional ? IsOptionalInt() : IsRequiredInt();
}

export function IsGetAllUsersLimit({ isOptional = true }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsIntByOptionality(isOptional), Min(1), Max(MAX_GET_ALL_USERS_LIMIT));
}

export function IsGetAllSessionLogsLimit({ isOptional = true }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsIntByOptionality(isOptional), Min(1), Max(MAX_GET_ALL_SESSION_LOGS_LIMIT));
}

export function IsGetAllChatsLimit({ isOptional = true }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsIntByOptionality(isOptional), Min(1), Max(MAX_GET_ALL_CHATS_LIMIT));
}

export function IsGetAllContextsLimit({ isOptional = true }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsIntByOptionality(isOptional), Min(1), Max(MAX_GET_ALL_CONTEXTS_LIMIT));
}

export function IsGetAllPage({ isOptional = true }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsIntByOptionality(isOptional), IsInt(), Min(1));
}

export function IsGetAllOrderBy({ enumType, isOptional = true }: EnumValidatorOptions) {
  return applyDecorators(IsOptionalOrRequired(isOptional), IsEnum(enumType));
}

export function IsGetAllOrderDirection({ isOptional = true }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsOptionalOrRequired(isOptional), IsEnum(GetAllOrderDirection));
}

export function IsGetAllSelect({ enumType, isOptional = true }: EnumValidatorOptions) {
  return applyDecorators(IsOptionalOrRequired(isOptional), Transform(toNormalizedSelectValues), IsArray(), IsEnum(enumType, { each: true }));
}

export function IsPassword({ isOptional = false }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsStringByOptionality(isOptional), Length(minUserPasswordLength, maxUserPasswordLength));
}

export function IsUserEmail({ isOptional = false }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsStringByOptionality(isOptional, true), IsEmail());
}

export function IsUserIdentifier({ isOptional = false }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsStringByOptionality(isOptional, true));
}

export function IsClientPhoneNumber({ region, isOptional = false }: PhoneNumberValidatorOptions = {}) {
  return applyDecorators(IsStringByOptionality(isOptional), IsPhoneNumber(region));
}

export function IsClientAge({ isOptional = false }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsIntByOptionality(isOptional), IsInt(), Min(minUserClientAge), Max(maxUserClientAge));
}

export function IsClientGender({ isOptional = false }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsOptionalOrRequired(isOptional), IsEnum(ClientGenders));
}

export function IsToken({ isOptional = false }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsStringByOptionality(isOptional));
}

export function IsOtpSessionId({ isOptional = false }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsOptionalOrRequired(isOptional), IsUUID());
}

export function IsTOTPToken({ isOptional = false }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsStringByOptionality(isOptional), Length(6, 6));
}

export function IsBase32Secret({ isOptional = false }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsStringByOptionality(isOptional, true), Length(16, 32));
}

export function IsUsername({ isOptional = false }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsStringByOptionality(isOptional, true), IsAlphanumeric(), Length(minUserUsernameLength, maxUserUsernameLength));
}

export function IsDisplayName({ isOptional = false }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsStringByOptionality(isOptional), Length(minUserDisplayNameLength, maxUserDisplayNameLength));
}

export function IsChatTitle({ isOptional = true }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsStringByOptionality(isOptional), Length(minChatTitleLength, maxChatTitleLength));
}

export function IsChatId({ isOptional = true }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsOptionalOrRequired(isOptional), IsUUID());
}

export function IsJobId({ isOptional = false }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsStringByOptionality(isOptional));
}

export function IsJobQueue({ isOptional = false }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsOptionalOrRequired(isOptional), IsEnum(QUEUES));
}

export function IsContextQuestion({ isOptional = false }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsStringByOptionality(isOptional, false), Length(minContextQuestionLength, maxContextQuestionLength));
}

export function IsContextAnswer({ isOptional = false }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsStringByOptionality(isOptional, false), Length(minContextAnswerLength, maxContextAnswerLength));
}

export function IsContextTags({ isOptional = true }: OptionalValidatorOptions = {}) {
  return applyDecorators(
    IsOptionalOrRequired(isOptional),
    IsArray(),
    Length(minContextTagLength, maxContextTagLength, { each: true }),
    IsString({ each: true }),
  );
}

export function IsUserPromptContextLimit({ isOptional = true }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsNumberByOptionality(isOptional), Min(minUserPromptContextLimit), Max(maxUserPromptContextLimit));
}

export function IsUserPrompt({ isOptional = false }: OptionalValidatorOptions = {}) {
  return applyDecorators(IsStringByOptionality(isOptional), Length(minUserPromptLength, maxUserPromptLength));
}
