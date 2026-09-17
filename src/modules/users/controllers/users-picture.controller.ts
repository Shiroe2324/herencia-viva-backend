import { Controller, Delete, HttpStatus, Param, Patch, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { USERS_PICTURE_TAG } from '@/constants';
import { CurrentUser, Private, RequiredRoles } from '@/decorators';
import { UserRoles } from '@/enums';
import { ParseImageFilePipe } from '@/pipes/parse-image-file.pipe';
import { ApiDeleteUserPictureDocs, ApiUpdateUserPictureDocs } from '@/users/docs/definitions/users-picture.doc';
import { DeleteUserPictureResponse, UpdateUserPictureResponse } from '@/users/dtos/picture';
import { UsersPictureService } from '@/users/services/users-picture.service';

@ApiTags(USERS_PICTURE_TAG.NAME)
@Controller('users')
@Private()
@RequiredRoles([{ param: 'identifier', exceptValues: ['me'], roles: [UserRoles.ADMIN] }])
export class UsersPictureController {
  constructor(private readonly usersPictureService: UsersPictureService) {}

  @Patch(':identifier/picture')
  @ApiUpdateUserPictureDocs()
  @UseInterceptors(FileInterceptor('picture'))
  public async updatePicture(
    @UploadedFile(new ParseImageFilePipe()) picture: Express.Multer.File,
    @Param('identifier') identifier: string,
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UpdateUserPictureResponse | void> {
    const targetIsOwnUser = identifier.toLowerCase() === 'me';
    const targetId = targetIsOwnUser ? userId : identifier;
    const jobId = await this.usersPictureService.updatePicture(targetId, picture);

    if (!jobId) {
      res.status(HttpStatus.NO_CONTENT);
    } else {
      res.status(HttpStatus.ACCEPTED);
      return { jobId };
    }
  }

  @Delete(':identifier/picture')
  @ApiDeleteUserPictureDocs()
  public async deletePicture(
    @Param('identifier') identifier: string,
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DeleteUserPictureResponse | void> {
    const targetIsOwnUser = identifier.toLowerCase() === 'me';
    const targetId = targetIsOwnUser ? userId : identifier;
    const jobId = await this.usersPictureService.deletePicture(targetId);

    if (!jobId) {
      res.status(HttpStatus.NO_CONTENT);
    } else {
      res.status(HttpStatus.ACCEPTED);
      return { jobId };
    }
  }
}
