import { Injectable } from '@nestjs/common';
import { PageRepository } from './page.repository';

@Injectable()
export class PageService {
  constructor(private pageRepository: PageRepository) {}
}
