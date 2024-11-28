import { HttpException, HttpStatus } from '@nestjs/common';

export class NotWorkspaceOwnerException extends HttpException {
  constructor() {
    super('해당 워크스페이스의 소유자가 아닙니다.', HttpStatus.FORBIDDEN);
  }
}
