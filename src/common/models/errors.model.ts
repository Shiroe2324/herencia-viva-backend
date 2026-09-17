import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import {
  DATE_EXAMPLE,
  HTTP_ERROR_RESPONSE_DOCS,
  HTTP_ERROR_RESPONSES_DOCS,
  VALIDATION_ERROR_ITEM_DOCS,
  VALIDATION_ERROR_RESPONSE_DOCS,
} from '@/constants';

const { BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT, TOO_MANY_REQUESTS, SERVICE_UNAVAILABLE } = HTTP_ERROR_RESPONSES_DOCS;

@ApiSchema({ name: VALIDATION_ERROR_ITEM_DOCS.NAME, description: VALIDATION_ERROR_ITEM_DOCS.DESCRIPTION })
class ValidationErrorItem {
  @ApiProperty({ description: VALIDATION_ERROR_ITEM_DOCS.FIELDS.FIELD, example: VALIDATION_ERROR_ITEM_DOCS.EXAMPLES.FIELD })
  public field!: string;

  @ApiProperty({ description: VALIDATION_ERROR_ITEM_DOCS.FIELDS.MESSAGE, example: VALIDATION_ERROR_ITEM_DOCS.EXAMPLES.MESSAGE })
  public message!: string;
}

@ApiSchema({ name: HTTP_ERROR_RESPONSE_DOCS.NAME, description: HTTP_ERROR_RESPONSE_DOCS.DESCRIPTION })
export class HttpErrorModel {
  @ApiProperty({ description: HTTP_ERROR_RESPONSE_DOCS.FIELDS.STATUS_CODE, example: HttpStatus.INTERNAL_SERVER_ERROR })
  public statusCode!: number;

  @ApiProperty({ description: HTTP_ERROR_RESPONSE_DOCS.FIELDS.ERROR, example: HTTP_ERROR_RESPONSE_DOCS.EXAMPLES.ERROR })
  public error!: string;

  @ApiProperty({ description: HTTP_ERROR_RESPONSE_DOCS.FIELDS.CODE, example: HTTP_ERROR_RESPONSE_DOCS.EXAMPLES.CODE })
  public code!: string;

  @ApiProperty({ description: HTTP_ERROR_RESPONSE_DOCS.FIELDS.MESSAGE, example: HTTP_ERROR_RESPONSE_DOCS.EXAMPLES.MESSAGE })
  public message!: string;

  @ApiProperty({ description: HTTP_ERROR_RESPONSE_DOCS.FIELDS.TIMESTAMP, example: DATE_EXAMPLE })
  public timestamp!: string;

  @ApiProperty({ description: HTTP_ERROR_RESPONSE_DOCS.FIELDS.PATH, example: HTTP_ERROR_RESPONSE_DOCS.EXAMPLES.PATH })
  public path!: string;
}

@ApiSchema({ name: VALIDATION_ERROR_RESPONSE_DOCS.NAME, description: VALIDATION_ERROR_RESPONSE_DOCS.DESCRIPTION })
export class ValidationErrorModel extends HttpErrorModel {
  @ApiProperty({ example: HttpStatus.UNPROCESSABLE_ENTITY })
  public statusCode!: number;

  @ApiProperty({ example: VALIDATION_ERROR_RESPONSE_DOCS.EXAMPLES.ERROR })
  public error!: string;

  @ApiProperty({
    isArray: true,
    type: ValidationErrorItem,
    description: VALIDATION_ERROR_RESPONSE_DOCS.FIELDS.ERRORS,
    example: VALIDATION_ERROR_RESPONSE_DOCS.EXAMPLES.ERRORS,
  })
  public errors!: ValidationErrorItem[];
}

@ApiSchema({ name: BAD_REQUEST.NAME, description: BAD_REQUEST.DESCRIPTION })
export class BadRequestModel extends HttpErrorModel {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  public statusCode!: number;

  @ApiProperty({ example: BAD_REQUEST.ERROR })
  public error!: string;

  @ApiProperty({ example: BAD_REQUEST.MESSAGE })
  public message!: string;
}

@ApiSchema({ name: UNAUTHORIZED.NAME, description: UNAUTHORIZED.DESCRIPTION })
export class UnauthorizedModel extends HttpErrorModel {
  @ApiProperty({ example: HttpStatus.UNAUTHORIZED })
  public statusCode!: number;

  @ApiProperty({ example: UNAUTHORIZED.ERROR })
  public error!: string;

  @ApiProperty({ example: UNAUTHORIZED.MESSAGE })
  public message!: string;
}

@ApiSchema({ name: FORBIDDEN.NAME, description: FORBIDDEN.DESCRIPTION })
export class ForbiddenModel extends HttpErrorModel {
  @ApiProperty({ example: HttpStatus.FORBIDDEN })
  public statusCode!: number;

  @ApiProperty({ example: FORBIDDEN.ERROR })
  public error!: string;

  @ApiProperty({ example: FORBIDDEN.MESSAGE })
  public message!: string;
}

@ApiSchema({ name: NOT_FOUND.NAME, description: NOT_FOUND.DESCRIPTION })
export class NotFoundModel extends HttpErrorModel {
  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  public statusCode!: number;

  @ApiProperty({ example: NOT_FOUND.ERROR })
  public error!: string;

  @ApiProperty({ example: NOT_FOUND.MESSAGE })
  public message!: string;
}

@ApiSchema({ name: CONFLICT.NAME, description: CONFLICT.DESCRIPTION })
export class ConflictModel extends HttpErrorModel {
  @ApiProperty({ example: HttpStatus.CONFLICT })
  public statusCode!: number;

  @ApiProperty({ example: CONFLICT.ERROR })
  public error!: string;

  @ApiProperty({ example: CONFLICT.MESSAGE })
  public message!: string;
}

@ApiSchema({ name: TOO_MANY_REQUESTS.NAME, description: TOO_MANY_REQUESTS.DESCRIPTION })
export class TooManyRequestsModel extends HttpErrorModel {
  @ApiProperty({ example: HttpStatus.TOO_MANY_REQUESTS })
  public statusCode!: number;

  @ApiProperty({ example: TOO_MANY_REQUESTS.ERROR })
  public error!: string;

  @ApiProperty({ example: TOO_MANY_REQUESTS.MESSAGE })
  public message!: string;
}

@ApiSchema({ name: SERVICE_UNAVAILABLE.NAME, description: SERVICE_UNAVAILABLE.DESCRIPTION })
export class ServiceUnavailableModel extends HttpErrorModel {
  @ApiProperty({ example: HttpStatus.SERVICE_UNAVAILABLE })
  public statusCode!: number;

  @ApiProperty({ example: SERVICE_UNAVAILABLE.ERROR })
  public error!: string;

  @ApiProperty({ example: SERVICE_UNAVAILABLE.MESSAGE })
  public message!: string;
}
