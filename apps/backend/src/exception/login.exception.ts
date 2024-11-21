import { ForbiddenException } from '@nestjs/common';

export class LoginRequiredException extends ForbiddenException {
  constructor() {
    super(`로그인이 필요한 서비스입니다.`);
  }
}
