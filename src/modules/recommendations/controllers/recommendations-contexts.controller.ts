import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RECOMMENDATIONS_CONTEXTS_TAG } from '@/constants';
import { Private, RequiredRoles } from '@/decorators';
import { UserRoles } from '@/enums';
import { RecommendationContextModel } from '@/models';
import {
  ApiCreateRecommendationContextDocs,
  ApiDeleteRecommendationContextDocs,
  ApiGetAllRecommendationContextsDocs,
  ApiGetRecommendationContextDocs,
  ApiUpdateRecommendationContextDocs,
} from '@/recommendations/docs/definitions/recommendations-contexts.doc';
import {
  CreateContextRequest,
  GetAllRecommendationContextsRequest,
  GetAllRecommendationContextsResponse,
  PatchRecommendationContextRequest,
} from '@/recommendations/dtos/contexts';
import { RecommendationsContextsService } from '@/recommendations/services/recommendations-contexts.service';

@ApiTags(RECOMMENDATIONS_CONTEXTS_TAG.NAME)
@Controller('recommendations/contexts')
@Private()
@RequiredRoles([UserRoles.ADMIN])
export class RecommendationsContextsController {
  constructor(private readonly recommendationsContextsService: RecommendationsContextsService) {}

  @Get()
  @ApiGetAllRecommendationContextsDocs()
  @HttpCode(HttpStatus.OK)
  public getAll(@Query() query: GetAllRecommendationContextsRequest): Promise<GetAllRecommendationContextsResponse> {
    return this.recommendationsContextsService.getAll(query);
  }

  @Get(':contextId')
  @ApiGetRecommendationContextDocs()
  @HttpCode(HttpStatus.OK)
  public getOne(@Param('contextId') contextId: string): Promise<RecommendationContextModel> {
    return this.recommendationsContextsService.getOne(contextId);
  }

  @Post()
  @ApiCreateRecommendationContextDocs()
  @HttpCode(HttpStatus.CREATED)
  public create(@Body() body: CreateContextRequest): Promise<RecommendationContextModel> {
    return this.recommendationsContextsService.create(body);
  }

  @Patch(':contextId')
  @ApiUpdateRecommendationContextDocs()
  @HttpCode(HttpStatus.OK)
  public patch(@Param('contextId') contextId: string, @Body() body: PatchRecommendationContextRequest): Promise<RecommendationContextModel> {
    return this.recommendationsContextsService.patch(contextId, body);
  }

  @Delete(':contextId')
  @ApiDeleteRecommendationContextDocs()
  @HttpCode(HttpStatus.OK)
  public delete(@Param('contextId') contextId: string): Promise<RecommendationContextModel> {
    return this.recommendationsContextsService.delete(contextId);
  }
}
