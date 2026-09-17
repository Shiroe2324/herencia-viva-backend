import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import {
  DISABLE_MFA_DOCS,
  ENABLE_MFA_DOCS,
  GENERATE_MFA_DOCS,
  REGENERATE_MFA_BACKUP_CODES_DOCS,
  VALIDATE_MFA_LOGIN_DOCS,
} from '@/auth/docs/constants/auth-mfa.constant';
import { EnableMfaResponse, GenerateMfaResponse, RegenerateMfaBackupCodesResponse, ValidateMfaLoginResponse } from '@/auth/dtos/mfa';
import { ConflictModel, ForbiddenModel, NotFoundModel, UnauthorizedModel, ValidationErrorModel } from '@/models';

export function ApiGenerateMfaDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: GENERATE_MFA_DOCS.SUMMARY, description: GENERATE_MFA_DOCS.DESCRIPTION, operationId: GENERATE_MFA_DOCS.OPERATION_ID }),
    ApiOkResponse({ description: GENERATE_MFA_DOCS.RESULTS.OK, type: GenerateMfaResponse }),
    ApiUnauthorizedResponse({ description: GENERATE_MFA_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: GENERATE_MFA_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiUnprocessableEntityResponse({ description: GENERATE_MFA_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiEnableMfaDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('application/json'),
    ApiOperation({ summary: ENABLE_MFA_DOCS.SUMMARY, description: ENABLE_MFA_DOCS.DESCRIPTION, operationId: ENABLE_MFA_DOCS.OPERATION_ID }),
    ApiOkResponse({ description: ENABLE_MFA_DOCS.RESULTS.OK, type: EnableMfaResponse }),
    ApiUnauthorizedResponse({ description: ENABLE_MFA_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: ENABLE_MFA_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiConflictResponse({ description: ENABLE_MFA_DOCS.RESULTS.CONFLICT, type: ConflictModel }),
    ApiUnprocessableEntityResponse({ description: ENABLE_MFA_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiDisableMfaDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('application/json'),
    ApiOperation({ summary: DISABLE_MFA_DOCS.SUMMARY, description: DISABLE_MFA_DOCS.DESCRIPTION, operationId: DISABLE_MFA_DOCS.OPERATION_ID }),
    ApiNoContentResponse({ description: DISABLE_MFA_DOCS.RESULTS.OK }),
    ApiUnauthorizedResponse({ description: DISABLE_MFA_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: DISABLE_MFA_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiConflictResponse({ description: DISABLE_MFA_DOCS.RESULTS.CONFLICT, type: ConflictModel }),
    ApiUnprocessableEntityResponse({ description: DISABLE_MFA_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiValidateMfaLoginDocs() {
  return applyDecorators(
    ApiConsumes('application/json'),
    ApiOperation({
      summary: VALIDATE_MFA_LOGIN_DOCS.SUMMARY,
      description: VALIDATE_MFA_LOGIN_DOCS.DESCRIPTION,
      operationId: VALIDATE_MFA_LOGIN_DOCS.OPERATION_ID,
    }),
    ApiOkResponse({ description: VALIDATE_MFA_LOGIN_DOCS.RESULTS.OK, type: ValidateMfaLoginResponse }),
    ApiUnauthorizedResponse({ description: VALIDATE_MFA_LOGIN_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: VALIDATE_MFA_LOGIN_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiNotFoundResponse({ description: VALIDATE_MFA_LOGIN_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
    ApiUnprocessableEntityResponse({ description: VALIDATE_MFA_LOGIN_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiRegenerateMfaBackupCodesDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('application/json'),
    ApiOperation({
      summary: REGENERATE_MFA_BACKUP_CODES_DOCS.SUMMARY,
      description: REGENERATE_MFA_BACKUP_CODES_DOCS.DESCRIPTION,
      operationId: 'regenerateMfaBackupCodes',
    }),
    ApiOkResponse({ description: REGENERATE_MFA_BACKUP_CODES_DOCS.RESULTS.OK, type: RegenerateMfaBackupCodesResponse }),
    ApiUnauthorizedResponse({ description: REGENERATE_MFA_BACKUP_CODES_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: REGENERATE_MFA_BACKUP_CODES_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiConflictResponse({ description: REGENERATE_MFA_BACKUP_CODES_DOCS.RESULTS.CONFLICT, type: ConflictModel }),
    ApiUnprocessableEntityResponse({ description: REGENERATE_MFA_BACKUP_CODES_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}
