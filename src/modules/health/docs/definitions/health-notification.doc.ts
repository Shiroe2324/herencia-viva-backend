import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { ApiSse } from '@/decorators';
import { HEALTH_NOTIFICATIONS_DOCS } from '@/health/docs/constants/health-notifications.constant';
import { HealthJobNotificationEvent } from '@/health/dtos/notifications';
import { UnauthorizedModel, ValidationErrorModel } from '@/models';

export function ApiHealthNotificationsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: HEALTH_NOTIFICATIONS_DOCS.SUMMARY,
      description: HEALTH_NOTIFICATIONS_DOCS.DESCRIPTION,
      operationId: HEALTH_NOTIFICATIONS_DOCS.OPERATION_ID,
    }),
    ApiSse({ summary: HEALTH_NOTIFICATIONS_DOCS.SUMMARY, description: HEALTH_NOTIFICATIONS_DOCS.DESCRIPTION, events: HealthJobNotificationEvent }),
    ApiUnauthorizedResponse({ description: HEALTH_NOTIFICATIONS_DOCS.RESULTS.UNAUTHORIZED, type: UnauthorizedModel }),
    ApiUnprocessableEntityResponse({ description: HEALTH_NOTIFICATIONS_DOCS.RESULTS.UNPROCESSABLE_ENTITY, type: ValidationErrorModel }),
  );
}
