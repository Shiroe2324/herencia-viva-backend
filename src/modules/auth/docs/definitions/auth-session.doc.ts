import { applyDecorators } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { VALIDATE_MFA_LOGIN_DOCS } from '@/auth/docs/constants/auth-mfa.constant';
import { LOGIN_DOCS, LOGOUT_DOCS, REFRESH_DOCS } from '@/auth/docs/constants/auth-session.constant';
import { LoginMfaRequiredResponse, LoginResponse, RefreshTokensResponse } from '@/auth/dtos/session';
import { ForbiddenModel, NotFoundModel, UnauthorizedModel, ValidationErrorModel } from '@/models';

export function ApiLoginDocs() {
  return applyDecorators(
    ApiConsumes('application/json'),
    ApiOperation({ summary: LOGIN_DOCS.SUMMARY, description: LOGIN_DOCS.DESCRIPTION, operationId: LOGIN_DOCS.OPERATION_ID }),
    ApiOkResponse({ description: LOGIN_DOCS.RESULTS.OK, type: LoginResponse }),
    ApiAcceptedResponse({
      description: LOGIN_DOCS.RESULTS.ACCEPTED,
      type: LoginMfaRequiredResponse,
      links: { verifyMfa: { operationId: VALIDATE_MFA_LOGIN_DOCS.OPERATION_ID, description: LOGIN_DOCS.LINKS.VERIFY_MFA_LOGIN } },
    }),
    ApiForbiddenResponse({ description: LOGIN_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiNotFoundResponse({ description: LOGIN_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
    ApiUnprocessableEntityResponse({ description: LOGIN_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiLogoutDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('application/json'),
    ApiOperation({ summary: LOGOUT_DOCS.SUMMARY, description: LOGOUT_DOCS.DESCRIPTION, operationId: LOGOUT_DOCS.OPERATION_ID }),
    ApiNoContentResponse({ description: LOGOUT_DOCS.RESULTS.NO_CONTENT }),
    ApiUnauthorizedResponse({ description: LOGOUT_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiUnprocessableEntityResponse({ description: LOGOUT_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}

export function ApiRefreshDocs() {
  return applyDecorators(
    ApiConsumes('application/json'),
    ApiOperation({ summary: REFRESH_DOCS.SUMMARY, description: REFRESH_DOCS.DESCRIPTION, operationId: REFRESH_DOCS.OPERATION_ID }),
    ApiOkResponse({ description: REFRESH_DOCS.RESULTS.OK, type: RefreshTokensResponse }),
    ApiForbiddenResponse({ description: REFRESH_DOCS.RESULTS.FORBIDDEN, type: ForbiddenModel }),
    ApiNotFoundResponse({ description: REFRESH_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
    ApiUnprocessableEntityResponse({ description: REFRESH_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}
