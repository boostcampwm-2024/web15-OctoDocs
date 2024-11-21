import { NotFoundException } from '@nestjs/common';

export class EdgeNotFoundException extends NotFoundException {
  constructor() {
    super(`엣지를 찾지 못했습니다.`);
  }
}
