import { applyDecorators } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { USER_IDENTIFIER_EXAMPLE } from '@/constants';
import { BadRequestModel, ForbiddenModel, NotFoundModel, UnauthorizedModel } from '@/models';
import { DELETE_USER_PICTURE_DOCS, UPDATE_USER_PICTURE_DOCS } from '@/users/docs/constants/users-picture.constant';
import { DeleteUserPictureResponse, UpdateUserPictureRequest, UpdateUserPictureResponse } from '@/users/dtos/picture';

export function ApiUpdateUserPictureDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiBody({ type: UpdateUserPictureRequest }),
    ApiOperation({
      summary: UPDATE_USER_PICTURE_DOCS.SUMMARY,
      description: UPDATE_USER_PICTURE_DOCS.DESCRIPTION,
      operationId: UPDATE_USER_PICTURE_DOCS.OPERATION_ID,
    }),
    ApiParam({ name: 'identifier', description: UPDATE_USER_PICTURE_DOCS.PARAMS.IDENTIFIER, example: USER_IDENTIFIER_EXAMPLE }),
    ApiAcceptedResponse({ description: UPDATE_USER_PICTURE_DOCS.RESULTS.ACCEPTED, type: UpdateUserPictureResponse }),
    ApiNoContentResponse({ description: UPDATE_USER_PICTURE_DOCS.RESULTS.NO_CONTENT }),
    ApiUnauthorizedResponse({ description: UPDATE_USER_PICTURE_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiBadRequestResponse({ description: UPDATE_USER_PICTURE_DOCS.RESULTS.BAD_REQUEST, type: BadRequestModel }),
    ApiForbiddenResponse({ description: UPDATE_USER_PICTURE_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiNotFoundResponse({ description: UPDATE_USER_PICTURE_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
  );
}

export function ApiDeleteUserPictureDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: DELETE_USER_PICTURE_DOCS.SUMMARY,
      description: DELETE_USER_PICTURE_DOCS.DESCRIPTION,
      operationId: DELETE_USER_PICTURE_DOCS.OPERATION_ID,
    }),
    ApiParam({ name: 'identifier', description: DELETE_USER_PICTURE_DOCS.PARAMS.IDENTIFIER, example: USER_IDENTIFIER_EXAMPLE }),
    ApiAcceptedResponse({ description: DELETE_USER_PICTURE_DOCS.RESULTS.ACCEPTED, type: DeleteUserPictureResponse }),
    ApiNoContentResponse({ description: DELETE_USER_PICTURE_DOCS.RESULTS.NO_CONTENT }),
    ApiUnauthorizedResponse({ description: DELETE_USER_PICTURE_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiForbiddenResponse({ description: DELETE_USER_PICTURE_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiNotFoundResponse({ description: DELETE_USER_PICTURE_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
  );
}
