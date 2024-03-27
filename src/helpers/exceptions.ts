import {
  ForbiddenException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

export class CustomForbiddenException extends ForbiddenException {
  constructor(message: string = 'Forbidden') {
    super({
      success: false,
      status: 403,
      message,
      code: 'forbidden_resource',
    });
  }
}
export class CustomUnprocessableEntityException extends UnprocessableEntityException {
  constructor(message: string = 'Invalid') {
    super({
      success: false,
      status: 422,
      message,
      errors: {},
      data: null,
      code: 'invalid',
    });
  }
}
export class CustomUnauthorizedException extends UnauthorizedException {
  constructor(message: string = 'UnAuthorized') {
    super({
      success: false,
      status: 401,
      message,
      errors: {},
      data: null,
      code: 'unauthorized',
    });
  }
}
