import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { FORGOT_PASSWORD_DOCS, RESET_PASSWORD_DOCS, SET_PASSWORD_DOCS, UPDATE_PASSWORD_DOCS } from '@/auth/docs/constants/auth-password.constant';
import { ConflictModel, ForbiddenModel, NotFoundModel, UnauthorizedModel, ValidationErrorModel } from '@/models';

export function ApiForgotPasswordDocs() {
  return applyDecorators(
    ApiConsumes('application/json'),
    ApiOperation({
      summary: FORGOT_PASSWORD_DOCS.SUMMARY,
      description: FORGOT_PASSWORD_DOCS.DESCRIPTION,
      operationId: FORGOT_PASSWORD_DOCS.OPERATION_ID,
    }),
    ApiNoContentResponse({ description: FORGOT_PASSWORD_DOCS.RESULTS.NO_CONTENT }),
    ApiForbiddenResponse({ description: FORGOT_PASSWORD_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiNotFoundResponse({ description: FORGOT_PASSWORD_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
    ApiUnprocessableEntityResponse({ description: FORGOT_PASSWORD_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiResetPasswordDocs() {
  return applyDecorators(
    ApiConsumes('application/json'),
    ApiOperation({
      summary: RESET_PASSWORD_DOCS.SUMMARY,
      description: RESET_PASSWORD_DOCS.DESCRIPTION,
      operationId: RESET_PASSWORD_DOCS.OPERATION_ID,
    }),
    ApiNoContentResponse({ description: RESET_PASSWORD_DOCS.RESULTS.NO_CONTENT }),
    ApiForbiddenResponse({ description: RESET_PASSWORD_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiNotFoundResponse({ description: RESET_PASSWORD_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
    ApiUnprocessableEntityResponse({ description: RESET_PASSWORD_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiUpdatePasswordDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('application/json'),
    ApiOperation({
      summary: UPDATE_PASSWORD_DOCS.SUMMARY,
      description: UPDATE_PASSWORD_DOCS.DESCRIPTION,
      operationId: UPDATE_PASSWORD_DOCS.OPERATION_ID,
    }),
    ApiNoContentResponse({ description: UPDATE_PASSWORD_DOCS.RESULTS.NO_CONTENT }),
    ApiUnauthorizedResponse({ description: UPDATE_PASSWORD_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: UPDATE_PASSWORD_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiConflictResponse({ description: UPDATE_PASSWORD_DOCS.RESULTS.CONFLICT, type: ConflictModel }),
    ApiUnprocessableEntityResponse({ description: UPDATE_PASSWORD_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiSetPasswordDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('application/json'),
    ApiOperation({ summary: SET_PASSWORD_DOCS.SUMMARY, description: SET_PASSWORD_DOCS.DESCRIPTION, operationId: SET_PASSWORD_DOCS.OPERATION_ID }),
    ApiNoContentResponse({ description: SET_PASSWORD_DOCS.RESULTS.NO_CONTENT }),
    ApiUnauthorizedResponse({ description: SET_PASSWORD_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: SET_PASSWORD_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiConflictResponse({ description: SET_PASSWORD_DOCS.RESULTS.CONFLICT, type: ConflictModel }),
    ApiUnprocessableEntityResponse({ description: SET_PASSWORD_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}
