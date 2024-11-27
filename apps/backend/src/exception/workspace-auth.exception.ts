import { HttpException, HttpStatus } from '@nestjs/common';

export class NotWorkspaceOwnerException extends HttpException {
  constructor() {
    super('You are not the owner of this workspace.', HttpStatus.FORBIDDEN);
  }
}
