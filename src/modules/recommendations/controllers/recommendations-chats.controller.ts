import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RECOMMENDATIONS_CHATS_TAG } from '@/constants';
import { CurrentUser, Private } from '@/decorators';
import { RecommendationChatModel } from '@/models';
import {
  ApiDeleteChatDocs,
  ApiGetAllChatsDocs,
  ApiGetChatDocs,
  ApiPatchChatDocs,
} from '@/recommendations/docs/definitions/recommendations-chats.doc';
import { GetAllChatsRequest, GetAllChatsResponse, PatchRecommendationChatRequest } from '@/recommendations/dtos/chats';
import { RecommendationsChatsService } from '@/recommendations/services/recommendations-chats.service';

@ApiTags(RECOMMENDATIONS_CHATS_TAG.NAME)
@Controller('recommendations/chats')
@Private()
export class RecommendationsChatsController {
  constructor(private readonly recommendationsChatsService: RecommendationsChatsService) {}

  @Get()
  @ApiGetAllChatsDocs()
  @HttpCode(HttpStatus.OK)
  public getAll(@CurrentUser('id') userId: string, @Query() query: GetAllChatsRequest): Promise<GetAllChatsResponse> {
    return this.recommendationsChatsService.getAll(userId, query);
  }

  @Get(':chatId')
  @ApiGetChatDocs()
  @HttpCode(HttpStatus.OK)
  public getOne(@CurrentUser('id') userId: string, @Param('chatId') chatId: string): Promise<RecommendationChatModel> {
    return this.recommendationsChatsService.getOne(userId, chatId);
  }

  @Patch(':chatId')
  @ApiPatchChatDocs()
  @HttpCode(HttpStatus.OK)
  public patch(
    @CurrentUser('id') userId: string,
    @Param('chatId') chatId: string,
    @Body() body: PatchRecommendationChatRequest,
  ): Promise<RecommendationChatModel> {
    return this.recommendationsChatsService.patch(userId, chatId, body);
  }

  @Delete(':chatId')
  @ApiDeleteChatDocs()
  @HttpCode(HttpStatus.OK)
  public delete(@CurrentUser('id') userId: string, @Param('chatId') chatId: string): Promise<RecommendationChatModel> {
    return this.recommendationsChatsService.delete(userId, chatId);
  }
}
