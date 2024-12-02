import { BadRequestException } from '@nestjs/common';

export class UserAlreadyInWorkspaceException extends BadRequestException {
  constructor() {
    super('사용자가 이미 워크스페이스에 등록되어 있습니다.');
  }
}
