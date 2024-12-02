import { NotFoundException } from '@nestjs/common';

export class WorkspaceNotFoundException extends NotFoundException {
  constructor() {
    super(`워크스페이스를 찾지 못했습니다.`);
  }
}
