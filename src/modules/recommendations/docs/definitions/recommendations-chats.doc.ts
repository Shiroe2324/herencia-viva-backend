import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { UUID_EXAMPLE } from '@/constants';
import { ConflictModel, NotFoundModel, RecommendationChatModel, UnauthorizedModel, ValidationErrorModel } from '@/models';
import {
  DELETE_CHAT_DOCS,
  GET_ALL_CHATS_DOCS,
  GET_CHAT_DOCS,
  PATCH_CHAT_DOCS,
} from '@/recommendations/docs/constants/recommendations-chats.constant';
import { GetAllChatsResponse } from '@/recommendations/dtos/chats';

export function ApiGetAllChatsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: GET_ALL_CHATS_DOCS.SUMMARY,
      description: GET_ALL_CHATS_DOCS.DESCRIPTION,
      operationId: GET_ALL_CHATS_DOCS.OPERATION_ID,
    }),
    ApiOkResponse({ description: GET_ALL_CHATS_DOCS.RESULTS.OK, type: GetAllChatsResponse }),
    ApiUnauthorizedResponse({ description: GET_ALL_CHATS_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiUnprocessableEntityResponse({ description: GET_ALL_CHATS_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiGetChatDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: GET_CHAT_DOCS.SUMMARY,
      description: GET_CHAT_DOCS.DESCRIPTION,
      operationId: GET_CHAT_DOCS.OPERATION_ID,
    }),
    ApiParam({ name: 'chatId', description: GET_CHAT_DOCS.PARAMS.CHAT_ID, example: UUID_EXAMPLE }),
    ApiOkResponse({ description: GET_CHAT_DOCS.RESULTS.OK, type: RecommendationChatModel }),
    ApiUnauthorizedResponse({ description: GET_CHAT_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiNotFoundResponse({ description: GET_CHAT_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
  );
}

export function ApiPatchChatDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('application/json'),
    ApiOperation({
      summary: PATCH_CHAT_DOCS.SUMMARY,
      description: PATCH_CHAT_DOCS.DESCRIPTION,
      operationId: PATCH_CHAT_DOCS.OPERATION_ID,
    }),
    ApiParam({ name: 'chatId', description: PATCH_CHAT_DOCS.PARAMS.CHAT_ID, example: UUID_EXAMPLE }),
    ApiOkResponse({ description: PATCH_CHAT_DOCS.RESULTS.OK, type: RecommendationChatModel }),
    ApiUnauthorizedResponse({ description: PATCH_CHAT_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiNotFoundResponse({ description: PATCH_CHAT_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
    ApiConflictResponse({ description: PATCH_CHAT_DOCS.RESULTS.CONFLICT, type: ConflictModel }),
    ApiUnprocessableEntityResponse({ description: PATCH_CHAT_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiDeleteChatDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: DELETE_CHAT_DOCS.SUMMARY,
      description: DELETE_CHAT_DOCS.DESCRIPTION,
      operationId: DELETE_CHAT_DOCS.OPERATION_ID,
    }),
    ApiParam({ name: 'chatId', description: DELETE_CHAT_DOCS.PARAMS.CHAT_ID, example: UUID_EXAMPLE }),
    ApiOkResponse({ description: DELETE_CHAT_DOCS.RESULTS.OK, type: RecommendationChatModel }),
    ApiUnauthorizedResponse({ description: DELETE_CHAT_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiNotFoundResponse({ description: DELETE_CHAT_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
  );
}
