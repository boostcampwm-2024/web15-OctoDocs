import { ForbiddenException } from '@nestjs/common';

export class RefreshTokenException extends ForbiddenException {
  constructor() {
    super(`유효하지 않은 Refresh Token입니다.`);
  }
}
