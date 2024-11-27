import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super(`사용자를 찾지 못했습니다.`);
  }
}
