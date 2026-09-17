import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { REGISTER_DOCS, VERIFY_EMAIL_DOCS } from '@/auth/docs/constants/auth-registration.constant';
import { ConflictModel, ForbiddenModel, NotFoundModel, ServiceUnavailableModel, ValidationErrorModel } from '@/models';

export function ApiRegisterDocs() {
  return applyDecorators(
    ApiConsumes('application/json'),
    ApiOperation({ summary: REGISTER_DOCS.SUMMARY, description: REGISTER_DOCS.DESCRIPTION, operationId: REGISTER_DOCS.OPERATION_ID }),
    ApiNoContentResponse({ description: REGISTER_DOCS.RESULTS.NO_CONTENT }),
    ApiConflictResponse({ description: REGISTER_DOCS.RESULTS.CONFLICT, type: ConflictModel }),
    ApiUnprocessableEntityResponse({ description: REGISTER_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
    ApiServiceUnavailableResponse({ description: REGISTER_DOCS.RESULTS.SERVICE_UNAVAILABLE, type: ServiceUnavailableModel }),
  );
}

export function ApiVerifyEmailDocs() {
  return applyDecorators(
    ApiConsumes('application/json'),
    ApiOperation({ summary: VERIFY_EMAIL_DOCS.SUMMARY, description: VERIFY_EMAIL_DOCS.DESCRIPTION, operationId: VERIFY_EMAIL_DOCS.OPERATION_ID }),
    ApiNoContentResponse({ description: VERIFY_EMAIL_DOCS.RESULTS.NO_CONTENT }),
    ApiForbiddenResponse({ description: VERIFY_EMAIL_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiNotFoundResponse({ description: VERIFY_EMAIL_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
    ApiUnprocessableEntityResponse({ description: VERIFY_EMAIL_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}
