import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { JOB_ID_EXAMPLE } from '@/constants';
import { UPDATE_USER_PICTURE_DOCS } from '@/users/docs/constants/users-picture.constant';

const { REQUEST, RESPONSE } = UPDATE_USER_PICTURE_DOCS;

@ApiSchema({ name: REQUEST.NAME, description: REQUEST.DESCRIPTION })
export class UpdateUserPictureRequest {
  @ApiProperty({ type: 'string', format: 'binary', description: REQUEST.FIELDS.PICTURE })
  public picture!: File;
}

@ApiSchema({ name: RESPONSE.NAME, description: RESPONSE.DESCRIPTION })
export class UpdateUserPictureResponse {
  @ApiProperty({ description: RESPONSE.FIELDS.JOB_ID, example: JOB_ID_EXAMPLE })
  public jobId!: string;
}
