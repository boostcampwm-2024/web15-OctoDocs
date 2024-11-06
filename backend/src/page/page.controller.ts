import {
  Controller,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PageService } from './page.service';
import { Page } from './page.entity';
import { CreatePageDto, UpdatePageDto } from './page.dto';

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createPage(
    @Body() body: CreatePageDto,
  ): Promise<{ message: string; page: Page }> {
    const page = await this.pageService.createPage(body);
    return {
      message: 'Page and related Node successfully created',
      page,
    };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deletePage(@Param('id') id: number): Promise<{ message: string }> {
    await this.pageService.deletePage(id);
    return {
      message: `Page with ID ${id} successfully deleted`,
    };
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async updatePage(
    @Param('id') id: number,
    @Body() body: UpdatePageDto,
  ): Promise<{ message: string; page: Page }> {
    const page = await this.pageService.updatePage(id, body);
    return {
      message: 'Page and related Node successfully updated',
      page,
    };
  }
}
