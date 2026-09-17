import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';

import { MAX_IMAGE_FILE_SIZE } from '@/configs';

export class ParseImageFilePipe extends ParseFilePipe {
  constructor(maxSize = MAX_IMAGE_FILE_SIZE) {
    const maxFileSizeValidator = new MaxFileSizeValidator({ maxSize: 1024 * 1024 * maxSize });
    const fileTypeValidator = new FileTypeValidator({ fileType: /^image\/.*/ });

    super({ validators: [maxFileSizeValidator, fileTypeValidator] });
  }
}
