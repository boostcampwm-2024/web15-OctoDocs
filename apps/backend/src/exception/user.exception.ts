import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super(`사용자를 찾지 못했습니다. 회원가입 페이지로 리디렉션합니다.`);
  }
}
