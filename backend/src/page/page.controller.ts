import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto, UpdatePageDto } from './page.dto';

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createPage(@Body() body: CreatePageDto): Promise<{ message: string }> {
    await this.pageService.createPage(body);
    return {
      message: 'Page and related Node successfully created',
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
  ): Promise<{ message: string }> {
    await this.pageService.updatePage(id, body);
    return {
      message: 'Page and related Node successfully updated',
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPages() {
    return await this.pageService.getPages();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getPage(@Param('id') id: number) {
    return await this.pageService.getPage(id);
  }
}
