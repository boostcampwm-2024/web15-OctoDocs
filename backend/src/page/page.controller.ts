import { Controller, Post, Delete, Param, Body } from '@nestjs/common';
import { PageService } from './page.service';

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post('/')
  createPage(
    @Body('title') title: string,
    @Body('content') content: JSON,
    @Body('nodeId') nodeId: number,
  ): Promise<void> {
    return this.pageService.createPage(title, content, nodeId);
  }

  @Delete('/:id')
  deletePage(@Param('id') id: number): Promise<void> {
    return this.pageService.deletePage(id);
  }
}
