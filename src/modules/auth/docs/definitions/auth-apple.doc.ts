import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { APPLE_EXTERNAL_LOGIN_DOCS, APPLE_LOGIN_CALLBACK_DOCS, APPLE_LOGIN_DOCS } from '@/auth/docs/constants/auth-apple.constant';
import { AppleExternalLoginResponse } from '@/auth/dtos/apple';
import { ConflictModel, ForbiddenModel, ServiceUnavailableModel, UnauthorizedModel, ValidationErrorModel } from '@/models';

export function ApiAppleLoginDocs() {
  return applyDecorators(
    ApiOperation({ summary: APPLE_LOGIN_DOCS.SUMMARY, description: APPLE_LOGIN_DOCS.DESCRIPTION, operationId: APPLE_LOGIN_DOCS.OPERATION_ID }),
    ApiFoundResponse({ description: APPLE_LOGIN_DOCS.RESULTS.FOUND }),
  );
}

export function ApiAppleLoginCallbackDocs() {
  return applyDecorators(
    ApiOperation({
      summary: APPLE_LOGIN_CALLBACK_DOCS.SUMMARY,
      description: APPLE_LOGIN_CALLBACK_DOCS.DESCRIPTION,
      operationId: APPLE_LOGIN_CALLBACK_DOCS.OPERATION_ID,
    }),
    ApiFoundResponse({ description: APPLE_LOGIN_CALLBACK_DOCS.RESULTS.FOUND }),
    ApiUnauthorizedResponse({ description: APPLE_LOGIN_CALLBACK_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: APPLE_LOGIN_CALLBACK_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiConflictResponse({ description: APPLE_LOGIN_CALLBACK_DOCS.RESULTS.CONFLICT, type: ConflictModel }),
    ApiServiceUnavailableResponse({ description: APPLE_LOGIN_CALLBACK_DOCS.RESULTS.SERVICE_UNAVAILABLE, type: ServiceUnavailableModel }),
  );
}

export function ApiAppleExternalLoginDocs() {
  return applyDecorators(
    ApiConsumes('application/json'),
    ApiOperation({
      summary: APPLE_EXTERNAL_LOGIN_DOCS.SUMMARY,
      description: APPLE_EXTERNAL_LOGIN_DOCS.DESCRIPTION,
      operationId: APPLE_EXTERNAL_LOGIN_DOCS.OPERATION_ID,
    }),
    ApiOkResponse({ description: APPLE_EXTERNAL_LOGIN_DOCS.RESULTS.OK, type: AppleExternalLoginResponse }),
    ApiUnauthorizedResponse({ description: APPLE_EXTERNAL_LOGIN_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: APPLE_EXTERNAL_LOGIN_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiConflictResponse({ description: APPLE_EXTERNAL_LOGIN_DOCS.RESULTS.CONFLICT, type: ConflictModel }),
    ApiUnprocessableEntityResponse({ description: APPLE_EXTERNAL_LOGIN_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
    ApiServiceUnavailableResponse({ description: APPLE_EXTERNAL_LOGIN_DOCS.RESULTS.SERVICE_UNAVAILABLE, type: ServiceUnavailableModel }),
  );
}
