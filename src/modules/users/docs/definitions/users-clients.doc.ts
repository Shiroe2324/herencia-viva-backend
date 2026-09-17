import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { UUID_EXAMPLE } from '@/constants';
import { ConflictModel, ForbiddenModel, NotFoundModel, UnauthorizedModel, UserClientModel, ValidationErrorModel } from '@/models';
import { CREATE_CLIENT_DOCS, GET_CLIENT_DOCS, PATCH_CLIENT_DOCS } from '@/users/docs/constants/users-clients.constant';

export function ApiGetClientDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: GET_CLIENT_DOCS.SUMMARY, description: GET_CLIENT_DOCS.DESCRIPTION, operationId: GET_CLIENT_DOCS.OPERATION_ID }),
    ApiParam({ name: 'identifier', description: GET_CLIENT_DOCS.PARAMS.IDENTIFIER, example: UUID_EXAMPLE }),
    ApiOkResponse({ description: GET_CLIENT_DOCS.RESULTS.OK, type: UserClientModel }),
    ApiUnauthorizedResponse({ description: GET_CLIENT_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: GET_CLIENT_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiNotFoundResponse({ description: GET_CLIENT_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
  );
}

export function ApiCreateClientDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('application/json'),
    ApiOperation({ summary: CREATE_CLIENT_DOCS.SUMMARY, description: CREATE_CLIENT_DOCS.DESCRIPTION, operationId: CREATE_CLIENT_DOCS.OPERATION_ID }),
    ApiOkResponse({ description: CREATE_CLIENT_DOCS.RESULTS.OK, type: UserClientModel }),
    ApiUnauthorizedResponse({ description: CREATE_CLIENT_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: CREATE_CLIENT_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiConflictResponse({ description: CREATE_CLIENT_DOCS.RESULTS.CONFLICT, type: ConflictModel }),
    ApiUnprocessableEntityResponse({ description: CREATE_CLIENT_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiPatchClientDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('application/json'),
    ApiOperation({ summary: PATCH_CLIENT_DOCS.SUMMARY, description: PATCH_CLIENT_DOCS.DESCRIPTION, operationId: PATCH_CLIENT_DOCS.OPERATION_ID }),
    ApiParam({ name: 'identifier', description: PATCH_CLIENT_DOCS.PARAMS.IDENTIFIER, example: UUID_EXAMPLE }),
    ApiOkResponse({ description: PATCH_CLIENT_DOCS.RESULTS.OK, type: UserClientModel }),
    ApiUnauthorizedResponse({ description: PATCH_CLIENT_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: PATCH_CLIENT_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiConflictResponse({ description: PATCH_CLIENT_DOCS.RESULTS.CONFLICT, type: ConflictModel }),
    ApiUnprocessableEntityResponse({ description: PATCH_CLIENT_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}
