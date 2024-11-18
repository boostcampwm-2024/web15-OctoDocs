import { NotFoundException } from '@nestjs/common';

export class NodeNotFoundException extends NotFoundException {
  constructor() {
    super(`노드를 찾지 못했습니다.`);
  }
}
