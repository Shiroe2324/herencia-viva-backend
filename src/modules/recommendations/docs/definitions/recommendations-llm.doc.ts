import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { ApiSse } from '@/decorators';
import { NotFoundModel, ServiceUnavailableModel, UnauthorizedModel, ValidationErrorModel } from '@/models';
import { ASK_RECOMMENDATION_DOCS, ASK_RECOMMENDATION_STREAM_DOCS } from '@/recommendations/docs/constants/recommendations-llm.constant';
import { AskRecommendationResponse, AskRecommendationStreamEvent } from '@/recommendations/dtos/llm';

export function ApiAskRecommendationDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiConsumes('application/json'),
    ApiOperation({
      summary: ASK_RECOMMENDATION_DOCS.SUMMARY,
      description: ASK_RECOMMENDATION_DOCS.DESCRIPTION,
      operationId: ASK_RECOMMENDATION_DOCS.OPERATION_ID,
    }),
    ApiOkResponse({ description: ASK_RECOMMENDATION_DOCS.RESULTS.OK, type: AskRecommendationResponse }),
    ApiNotFoundResponse({ description: ASK_RECOMMENDATION_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
    ApiUnauthorizedResponse({ description: ASK_RECOMMENDATION_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiUnprocessableEntityResponse({ description: ASK_RECOMMENDATION_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
    ApiServiceUnavailableResponse({ description: ASK_RECOMMENDATION_DOCS.RESULTS.SERVICE_UNAVAILABLE, type: ServiceUnavailableModel }),
  );
}

export function ApiAskStreamRecommendationDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiSse({
      summary: ASK_RECOMMENDATION_STREAM_DOCS.SUMMARY,
      description: ASK_RECOMMENDATION_STREAM_DOCS.DESCRIPTION,
      events: AskRecommendationStreamEvent,
    }),
    ApiNotFoundResponse({ description: ASK_RECOMMENDATION_STREAM_DOCS.RESULTS.NOT_FOUND, type: NotFoundModel }),
    ApiUnauthorizedResponse({ description: ASK_RECOMMENDATION_STREAM_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiUnprocessableEntityResponse({ description: ASK_RECOMMENDATION_STREAM_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
    ApiServiceUnavailableResponse({ description: ASK_RECOMMENDATION_STREAM_DOCS.RESULTS.SERVICE_UNAVAILABLE, type: ServiceUnavailableModel }),
  );
}
