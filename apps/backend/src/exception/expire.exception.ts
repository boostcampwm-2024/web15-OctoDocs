import { UnauthorizedException } from '@nestjs/common';

export class ExpireException extends UnauthorizedException {
  constructor() {
    super(`Refresh Token이 만료되었으니 다시 로그인해주세요.`);
  }
}
