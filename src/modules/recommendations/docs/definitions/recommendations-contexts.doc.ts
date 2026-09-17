import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { UUID_EXAMPLE } from '@/constants';
import { ConflictModel, ForbiddenModel, NotFoundModel, RecommendationContextModel, UnauthorizedModel, ValidationErrorModel } from '@/models';
import {
  CREATE_RECOMMENDATION_CONTEXT_DOCS,
  DELETE_RECOMMENDATION_CONTEXT_DOCS,
  GET_ALL_RECOMMENDATION_CONTEXTS_DOCS,
  GET_RECOMMENDATION_CONTEXT_DOCS,
  PATCH_RECOMMENDATION_CONTEXT_DOCS,
} from '@/recommendations/docs/constants/recommendations-contexts.constant';
import { GetAllRecommendationContextsResponse } from '@/recommendations/dtos/contexts';

export function ApiGetAllRecommendationContextsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: GET_ALL_RECOMMENDATION_CONTEXTS_DOCS.SUMMARY,
      description: GET_ALL_RECOMMENDATION_CONTEXTS_DOCS.DESCRIPTION,
      operationId: GET_ALL_RECOMMENDATION_CONTEXTS_DOCS.OPERATION_ID,
    }),
    ApiOkResponse({ description: GET_ALL_RECOMMENDATION_CONTEXTS_DOCS.RESULTS.OK, type: GetAllRecommendationContextsResponse }),
    ApiUnauthorizedResponse({ description: GET_ALL_RECOMMENDATION_CONTEXTS_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: GET_ALL_RECOMMENDATION_CONTEXTS_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiUnprocessableEntityResponse({ description: GET_ALL_RECOMMENDATION_CONTEXTS_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiGetRecommendationContextDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: GET_RECOMMENDATION_CONTEXT_DOCS.SUMMARY,
      description: GET_RECOMMENDATION_CONTEXT_DOCS.DESCRIPTION,
      operationId: GET_RECOMMENDATION_CONTEXT_DOCS.OPERATION_ID,
    }),
    ApiParam({ name: 'contextId', description: GET_RECOMMENDATION_CONTEXT_DOCS.PARAMS.CONTEXT_ID, example: UUID_EXAMPLE }),
    ApiOkResponse({ description: GET_RECOMMENDATION_CONTEXT_DOCS.RESULTS.OK, type: RecommendationContextModel }),
    ApiUnauthorizedResponse({ description: GET_RECOMMENDATION_CONTEXT_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: GET_RECOMMENDATION_CONTEXT_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiNotFoundResponse({ description: GET_RECOMMENDATION_CONTEXT_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
  );
}

export function ApiCreateRecommendationContextDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('application/json'),
    ApiOperation({
      summary: CREATE_RECOMMENDATION_CONTEXT_DOCS.SUMMARY,
      description: CREATE_RECOMMENDATION_CONTEXT_DOCS.DESCRIPTION,
      operationId: CREATE_RECOMMENDATION_CONTEXT_DOCS.OPERATION_ID,
    }),
    ApiCreatedResponse({ description: CREATE_RECOMMENDATION_CONTEXT_DOCS.RESULTS.CREATED, type: RecommendationContextModel }),
    ApiUnauthorizedResponse({ description: CREATE_RECOMMENDATION_CONTEXT_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: CREATE_RECOMMENDATION_CONTEXT_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiUnprocessableEntityResponse({ description: CREATE_RECOMMENDATION_CONTEXT_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiUpdateRecommendationContextDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('application/json'),
    ApiOperation({
      summary: PATCH_RECOMMENDATION_CONTEXT_DOCS.SUMMARY,
      description: PATCH_RECOMMENDATION_CONTEXT_DOCS.DESCRIPTION,
      operationId: PATCH_RECOMMENDATION_CONTEXT_DOCS.OPERATION_ID,
    }),
    ApiParam({ name: 'contextId', description: PATCH_RECOMMENDATION_CONTEXT_DOCS.PARAMS.CONTEXT_ID, example: UUID_EXAMPLE }),
    ApiOkResponse({ description: PATCH_RECOMMENDATION_CONTEXT_DOCS.RESULTS.OK, type: RecommendationContextModel }),
    ApiUnauthorizedResponse({ description: PATCH_RECOMMENDATION_CONTEXT_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: PATCH_RECOMMENDATION_CONTEXT_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiNotFoundResponse({ description: PATCH_RECOMMENDATION_CONTEXT_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
    ApiConflictResponse({ description: PATCH_RECOMMENDATION_CONTEXT_DOCS.RESULTS.CONFLICT, type: ConflictModel }),
    ApiUnprocessableEntityResponse({ description: PATCH_RECOMMENDATION_CONTEXT_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiDeleteRecommendationContextDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: DELETE_RECOMMENDATION_CONTEXT_DOCS.SUMMARY,
      description: DELETE_RECOMMENDATION_CONTEXT_DOCS.DESCRIPTION,
      operationId: DELETE_RECOMMENDATION_CONTEXT_DOCS.OPERATION_ID,
    }),
    ApiParam({ name: 'contextId', description: DELETE_RECOMMENDATION_CONTEXT_DOCS.PARAMS.CONTEXT_ID, example: UUID_EXAMPLE }),
    ApiOkResponse({ description: DELETE_RECOMMENDATION_CONTEXT_DOCS.RESULTS.OK, type: RecommendationContextModel }),
    ApiUnauthorizedResponse({ description: DELETE_RECOMMENDATION_CONTEXT_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: DELETE_RECOMMENDATION_CONTEXT_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiNotFoundResponse({ description: DELETE_RECOMMENDATION_CONTEXT_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
  );
}
