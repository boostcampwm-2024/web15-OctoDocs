import { ForbiddenException } from '@nestjs/common';

export class InvalidTokenException extends ForbiddenException {
  constructor() {
    super(`유효하지 않은 JWT 토큰입니다.`);
  }
}
