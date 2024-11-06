import { Injectable, NotFoundException } from '@nestjs/common';
import { PageRepository } from './page.repository';

@Injectable()
export class PageService {
  constructor(private pageRepository: PageRepository) {}

  async deletePage(id: number): Promise<void> {
    const page = await this.pageRepository.findOneBy({ id });
    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    await this.pageRepository.delete(id);
  }
}
