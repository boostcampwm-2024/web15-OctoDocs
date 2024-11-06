import { Controller, Get } from '@nestjs/common';
import { PageService } from './page.service';

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get()
  async getPages() {
    return await this.pageService.getPages();
  }
}
