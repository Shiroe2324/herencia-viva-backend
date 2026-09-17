import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

import { CHAT_TITLE_LENGTH_RANGE } from '@/configs';
import { RECOMMENDATION_CHAT_TITLE_EXAMPLE } from '@/constants';
import { IsChatTitle } from '@/decorators';
import { PATCH_CHAT_DOCS } from '@/recommendations/docs/constants/recommendations-chats.constant';

const { NAME, DESCRIPTION, FIELDS } = PATCH_CHAT_DOCS.REQUEST;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class PatchRecommendationChatRequest {
  @ApiPropertyOptional({ ...CHAT_TITLE_LENGTH_RANGE, description: FIELDS.TITLE, example: RECOMMENDATION_CHAT_TITLE_EXAMPLE })
  @IsChatTitle()
  public title?: string;
}
