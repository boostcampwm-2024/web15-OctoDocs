import { NotFoundException } from '@nestjs/common';

export class PageNotFoundException extends NotFoundException {
  constructor() {
    super(`페이지를 찾지 못했습니다.`);
  }
}
