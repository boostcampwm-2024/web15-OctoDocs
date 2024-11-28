import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenAccessException extends HttpException {
  constructor() {
    super('워크스페이스에 접근할 권한이 없습니다.', HttpStatus.FORBIDDEN);
  }
}
