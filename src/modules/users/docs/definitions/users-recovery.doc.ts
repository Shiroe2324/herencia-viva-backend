import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiConsumes,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { ConflictModel, NotFoundModel, UnauthorizedModel, ValidationErrorModel } from '@/models';
import { RECOVER_ACCOUNT_DOCS, SEND_RECOVERY_EMAIL_DOCS } from '@/users/docs/constants/users-recovery.constant';

export function ApiRecoverAccountDocs() {
  return applyDecorators(
    ApiConsumes('application/json'),
    ApiOperation({
      summary: RECOVER_ACCOUNT_DOCS.SUMMARY,
      description: RECOVER_ACCOUNT_DOCS.DESCRIPTION,
      operationId: RECOVER_ACCOUNT_DOCS.OPERATION_ID,
    }),
    ApiNoContentResponse({ description: RECOVER_ACCOUNT_DOCS.RESULTS.NO_CONTENT }),
    ApiUnauthorizedResponse({ description: RECOVER_ACCOUNT_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiNotFoundResponse({ description: RECOVER_ACCOUNT_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
    ApiUnprocessableEntityResponse({ description: RECOVER_ACCOUNT_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiSendRecoveryEmailDocs() {
  return applyDecorators(
    ApiConsumes('application/json'),
    ApiOperation({
      summary: SEND_RECOVERY_EMAIL_DOCS.SUMMARY,
      description: SEND_RECOVERY_EMAIL_DOCS.DESCRIPTION,
      operationId: SEND_RECOVERY_EMAIL_DOCS.OPERATION_ID,
    }),
    ApiNoContentResponse({ description: SEND_RECOVERY_EMAIL_DOCS.RESULTS.NO_CONTENT }),
    ApiNotFoundResponse({ description: SEND_RECOVERY_EMAIL_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
    ApiConflictResponse({ description: SEND_RECOVERY_EMAIL_DOCS.RESULTS.CONFLICT, type: ConflictModel }),
  );
}
