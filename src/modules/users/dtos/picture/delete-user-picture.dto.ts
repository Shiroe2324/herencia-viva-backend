import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { JOB_ID_EXAMPLE } from '@/constants';
import { DELETE_USER_PICTURE_DOCS } from '@/users/docs/constants/users-picture.constant';

const { NAME, DESCRIPTION, FIELDS } = DELETE_USER_PICTURE_DOCS.RESPONSE;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class DeleteUserPictureResponse {
  @ApiProperty({ type: String, nullable: true, description: FIELDS.JOB_ID, example: JOB_ID_EXAMPLE })
  public jobId!: string | null;
}
