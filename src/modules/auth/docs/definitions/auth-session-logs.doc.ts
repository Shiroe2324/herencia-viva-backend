import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import {
  CLOSE_OTHER_SESSIONS_DOCS,
  CLOSE_SESSION_DOCS,
  GET_ALL_SESSION_LOGS_DOCS,
  GET_ALL_USERS_SESSION_LOGS_DOCS,
  GET_CURRENT_SESSION_LOG_DOCS,
} from '@/auth/docs/constants/auth-session-logs.constant';
import { CloseOtherSessionsResponse, GetAllSessionLogsResponse, GetAllUsersSessionLogsResponse } from '@/auth/dtos/session-logs';
import { USER_IDENTIFIER_EXAMPLE, UUID_EXAMPLE } from '@/constants';
import { AuthSessionLogModel, ForbiddenModel, NotFoundModel, UnauthorizedModel, ValidationErrorModel } from '@/models';

export function ApiGetAllSessionLogsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: GET_ALL_SESSION_LOGS_DOCS.SUMMARY,
      description: GET_ALL_SESSION_LOGS_DOCS.DESCRIPTION,
      operationId: GET_ALL_SESSION_LOGS_DOCS.OPERATION_ID,
    }),
    ApiParam({ name: 'identifier', description: GET_ALL_SESSION_LOGS_DOCS.PARAMS.IDENTIFIER, example: USER_IDENTIFIER_EXAMPLE }),
    ApiOkResponse({ description: GET_ALL_SESSION_LOGS_DOCS.RESULTS.OK, type: GetAllSessionLogsResponse }),
    ApiUnauthorizedResponse({ description: GET_ALL_SESSION_LOGS_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: GET_ALL_SESSION_LOGS_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiUnprocessableEntityResponse({ description: GET_ALL_SESSION_LOGS_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiGetAllUsersSessionLogsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: GET_ALL_USERS_SESSION_LOGS_DOCS.SUMMARY,
      description: GET_ALL_USERS_SESSION_LOGS_DOCS.DESCRIPTION,
      operationId: GET_ALL_USERS_SESSION_LOGS_DOCS.OPERATION_ID,
    }),
    ApiOkResponse({ description: GET_ALL_USERS_SESSION_LOGS_DOCS.RESULTS.OK, type: GetAllUsersSessionLogsResponse }),
    ApiUnauthorizedResponse({ description: GET_ALL_USERS_SESSION_LOGS_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: GET_ALL_USERS_SESSION_LOGS_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiUnprocessableEntityResponse({ description: GET_ALL_USERS_SESSION_LOGS_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiGetCurrentSessionLogDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: GET_CURRENT_SESSION_LOG_DOCS.SUMMARY,
      description: GET_CURRENT_SESSION_LOG_DOCS.DESCRIPTION,
      operationId: GET_CURRENT_SESSION_LOG_DOCS.OPERATION_ID,
    }),
    ApiOkResponse({ description: GET_CURRENT_SESSION_LOG_DOCS.RESULTS.OK, type: AuthSessionLogModel }),
    ApiUnauthorizedResponse({ description: GET_CURRENT_SESSION_LOG_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiNotFoundResponse({ description: GET_CURRENT_SESSION_LOG_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
  );
}

export function ApiCloseOtherSessionsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: CLOSE_OTHER_SESSIONS_DOCS.SUMMARY,
      description: CLOSE_OTHER_SESSIONS_DOCS.DESCRIPTION,
      operationId: CLOSE_OTHER_SESSIONS_DOCS.OPERATION_ID,
    }),
    ApiParam({ name: 'identifier', description: CLOSE_OTHER_SESSIONS_DOCS.PARAMS.IDENTIFIER, example: USER_IDENTIFIER_EXAMPLE }),
    ApiOkResponse({ description: CLOSE_OTHER_SESSIONS_DOCS.RESULTS.OK, type: CloseOtherSessionsResponse }),
    ApiUnauthorizedResponse({ description: CLOSE_OTHER_SESSIONS_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: CLOSE_OTHER_SESSIONS_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
  );
}

export function ApiCloseSessionDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: CLOSE_SESSION_DOCS.SUMMARY,
      description: CLOSE_SESSION_DOCS.DESCRIPTION,
      operationId: CLOSE_SESSION_DOCS.OPERATION_ID,
    }),
    ApiParam({ name: 'identifier', description: CLOSE_SESSION_DOCS.PARAMS.IDENTIFIER, example: USER_IDENTIFIER_EXAMPLE }),
    ApiParam({ name: 'sessionId', description: CLOSE_SESSION_DOCS.PARAMS.SESSION_ID, example: UUID_EXAMPLE }),
    ApiNoContentResponse({ description: CLOSE_SESSION_DOCS.RESULTS.OK }),
    ApiUnauthorizedResponse({ description: CLOSE_SESSION_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: CLOSE_SESSION_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiNotFoundResponse({ description: CLOSE_SESSION_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
  );
}
