import { Controller, Delete, Param } from '@nestjs/common';
import { PageService } from './page.service';

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Delete(':id')
  deletePage(@Param('id') id: number): Promise<void> {
    return this.pageService.deletePage(id);
  }
}
