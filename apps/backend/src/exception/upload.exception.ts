import { BadRequestException } from '@nestjs/common';

export class InvalidFileException extends BadRequestException {
  constructor() {
    super(`유효하지 않은 파일입니다.`);
  }
}
