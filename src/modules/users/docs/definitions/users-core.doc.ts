import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { USER_IDENTIFIER_EXAMPLE } from '@/constants';
import { ConflictModel, ForbiddenModel, MeUserModel, NotFoundModel, UnauthorizedModel, UserModel, ValidationErrorModel } from '@/models';
import { DELETE_USER_DOCS, GET_ALL_USERS_DOCS, GET_USER_DOCS, PATCH_USER_DOCS } from '@/users/docs/constants/users-core.constant';
import { GetAllUsersResponse } from '@/users/dtos/core';

export const UserModelSchemaPath = [{ $ref: getSchemaPath(UserModel) }, { $ref: getSchemaPath(MeUserModel) }];

export function ApiGetAllUsersDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: GET_ALL_USERS_DOCS.SUMMARY, description: GET_ALL_USERS_DOCS.DESCRIPTION, operationId: GET_ALL_USERS_DOCS.OPERATION_ID }),
    ApiOkResponse({ description: GET_ALL_USERS_DOCS.RESULTS.OK, type: GetAllUsersResponse }),
    ApiUnauthorizedResponse({ description: GET_ALL_USERS_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiUnprocessableEntityResponse({ description: GET_ALL_USERS_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiGetUserDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: GET_USER_DOCS.SUMMARY, description: GET_USER_DOCS.DESCRIPTION, operationId: GET_USER_DOCS.OPERATION_ID }),
    ApiExtraModels(UserModel, MeUserModel),
    ApiParam({ name: 'identifier', description: GET_USER_DOCS.PARAMS.IDENTIFIER, example: USER_IDENTIFIER_EXAMPLE }),
    ApiOkResponse({ description: GET_USER_DOCS.RESULTS.OK, schema: { oneOf: UserModelSchemaPath } }),
    ApiUnauthorizedResponse({ description: GET_USER_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiNotFoundResponse({ description: GET_USER_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
  );
}

export function ApiPatchUserDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('application/json'),
    ApiOperation({ summary: PATCH_USER_DOCS.SUMMARY, description: PATCH_USER_DOCS.DESCRIPTION, operationId: PATCH_USER_DOCS.OPERATION_ID }),
    ApiExtraModels(UserModel, MeUserModel),
    ApiParam({ name: 'identifier', description: PATCH_USER_DOCS.PARAMS.IDENTIFIER, example: USER_IDENTIFIER_EXAMPLE }),
    ApiOkResponse({ description: PATCH_USER_DOCS.RESULTS.OK, schema: { oneOf: UserModelSchemaPath } }),
    ApiUnauthorizedResponse({ description: PATCH_USER_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: PATCH_USER_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiNotFoundResponse({ description: PATCH_USER_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
    ApiConflictResponse({ description: PATCH_USER_DOCS.RESULTS.CONFLICT, type: ConflictModel }),
    ApiUnprocessableEntityResponse({ description: PATCH_USER_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiDeleteUserDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: DELETE_USER_DOCS.SUMMARY, description: DELETE_USER_DOCS.DESCRIPTION, operationId: DELETE_USER_DOCS.OPERATION_ID }),
    ApiExtraModels(UserModel, MeUserModel),
    ApiParam({ name: 'identifier', description: DELETE_USER_DOCS.PARAMS.IDENTIFIER, example: USER_IDENTIFIER_EXAMPLE }),
    ApiOkResponse({ description: DELETE_USER_DOCS.RESULTS.OK, schema: { oneOf: UserModelSchemaPath } }),
    ApiUnauthorizedResponse({ description: DELETE_USER_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: DELETE_USER_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiNotFoundResponse({ description: DELETE_USER_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
  );
}
