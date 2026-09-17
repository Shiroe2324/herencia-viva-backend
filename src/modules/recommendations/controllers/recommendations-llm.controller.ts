import { Body, Controller, HttpCode, HttpStatus, MessageEvent, Post, Query, Sse } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';

import { RECOMMENDATIONS_LLM_TAG } from '@/constants';
import { CurrentUser, Private } from '@/decorators';
import { ApiAskRecommendationDocs, ApiAskStreamRecommendationDocs } from '@/recommendations/docs/definitions/recommendations-llm.doc';
import { AskRecommendationRequest, AskRecommendationResponse } from '@/recommendations/dtos/llm';
import { RecommendationsLLMService } from '@/recommendations/services/recommendations-llm.service';

@ApiTags(RECOMMENDATIONS_LLM_TAG.NAME)
@Controller('recommendations/llm')
@Private()
export class RecommendationsLLMController {
  constructor(private readonly recommendationsService: RecommendationsLLMService) {}

  @Post('ask')
  @ApiAskRecommendationDocs()
  @HttpCode(HttpStatus.OK)
  public askChat(@CurrentUser('id') userId: string, @Body() body: AskRecommendationRequest): Promise<AskRecommendationResponse> {
    return this.recommendationsService.askChat(userId, body);
  }

  @Sse('ask/stream')
  @ApiAskStreamRecommendationDocs()
  public askChatStream(@CurrentUser('id') userId: string, @Query() query: AskRecommendationRequest): Observable<MessageEvent> {
    return this.recommendationsService.askChatStream(userId, query).pipe(map((event) => ({ data: event })));
  }
}
