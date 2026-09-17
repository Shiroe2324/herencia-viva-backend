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

import { GOOGLE_EXTERNAL_LOGIN_DOCS, GOOGLE_LOGIN_CALLBACK_DOCS, GOOGLE_LOGIN_DOCS } from '@/auth/docs/constants/auth-google.constant';
import { GoogleExternalLoginResponse } from '@/auth/dtos/google';
import { ConflictModel, ForbiddenModel, ServiceUnavailableModel, UnauthorizedModel, ValidationErrorModel } from '@/models';

export function ApiGoogleLoginDocs() {
  return applyDecorators(
    ApiOperation({ summary: GOOGLE_LOGIN_DOCS.SUMMARY, description: GOOGLE_LOGIN_DOCS.DESCRIPTION, operationId: GOOGLE_LOGIN_DOCS.OPERATION_ID }),
    ApiFoundResponse({ description: GOOGLE_LOGIN_DOCS.RESULTS.FOUND }),
  );
}

export function ApiGoogleLoginCallbackDocs() {
  return applyDecorators(
    ApiOperation({
      summary: GOOGLE_LOGIN_CALLBACK_DOCS.SUMMARY,
      description: GOOGLE_LOGIN_CALLBACK_DOCS.DESCRIPTION,
      operationId: GOOGLE_LOGIN_CALLBACK_DOCS.OPERATION_ID,
    }),
    ApiFoundResponse({ description: GOOGLE_LOGIN_CALLBACK_DOCS.RESULTS.FOUND }),
    ApiUnauthorizedResponse({ description: GOOGLE_LOGIN_CALLBACK_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: GOOGLE_LOGIN_CALLBACK_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiConflictResponse({ description: GOOGLE_LOGIN_CALLBACK_DOCS.RESULTS.CONFLICT, type: ConflictModel }),
    ApiServiceUnavailableResponse({ description: GOOGLE_LOGIN_CALLBACK_DOCS.RESULTS.SERVICE_UNAVAILABLE, type: ServiceUnavailableModel }),
  );
}

export function ApiGoogleExternalLoginDocs() {
  return applyDecorators(
    ApiConsumes('application/json'),
    ApiOperation({
      summary: GOOGLE_EXTERNAL_LOGIN_DOCS.SUMMARY,
      description: GOOGLE_EXTERNAL_LOGIN_DOCS.DESCRIPTION,
      operationId: GOOGLE_EXTERNAL_LOGIN_DOCS.OPERATION_ID,
    }),
    ApiOkResponse({ description: GOOGLE_EXTERNAL_LOGIN_DOCS.RESULTS.OK, type: GoogleExternalLoginResponse }),
    ApiUnauthorizedResponse({ description: GOOGLE_EXTERNAL_LOGIN_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: GOOGLE_EXTERNAL_LOGIN_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiConflictResponse({ description: GOOGLE_EXTERNAL_LOGIN_DOCS.RESULTS.CONFLICT, type: ConflictModel }),
    ApiUnprocessableEntityResponse({ description: GOOGLE_EXTERNAL_LOGIN_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
    ApiServiceUnavailableResponse({ description: GOOGLE_EXTERNAL_LOGIN_DOCS.RESULTS.SERVICE_UNAVAILABLE, type: ServiceUnavailableModel }),
  );
}
