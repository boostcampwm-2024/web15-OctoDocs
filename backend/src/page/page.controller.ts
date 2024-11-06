import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PageService } from './page.service';
import { Page } from './page.entity';

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createPage(
    @Body('title') title: string,
    @Body('content') content: JSON,
  ): Promise<{ message: string; page: Page }> {
    const page = await this.pageService.createPage(title, content);
    return {
      message: 'Page and related Node successfully created',
      page,
    };
  }

  @Delete('/:id')
  async deletePage(@Param('id') id: number): Promise<void> {
    return await this.pageService.deletePage(id);
  }
}
