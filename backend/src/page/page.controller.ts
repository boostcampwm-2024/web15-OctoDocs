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
import { Page } from './page.entity';
import { PageService } from './page.service';
import { CreatePageDto, UpdatePageDto } from './page.dto';

export enum PageResponseMessage {
  PAGE_CREATED = '페이지와 노드를 생성했습니다.',
  PAGE_UPDATED = '페이지와 노드를 갱신했습니다.',
  PAGE_DELETED = '페이지와 노드를 삭제했습니다.',
  PAGE_RETURNED = '페이지를 가져왔습니다.',
  PAGE_LIST_RETURNED = '페이지 목록을 가져왔습니다',
}

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createPage(@Body() body: CreatePageDto): Promise<{ message: string }> {
    await this.pageService.createPage(body);
    return {
      message: PageResponseMessage.PAGE_CREATED,
    };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deletePage(@Param('id') id: number): Promise<{ message: string }> {
    await this.pageService.deletePage(id);
    return {
      message: PageResponseMessage.PAGE_DELETED,
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
      message: PageResponseMessage.PAGE_UPDATED,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findPages(): Promise<{ message: string; pages: Partial<Page>[] }> {
    return {
      message: PageResponseMessage.PAGE_LIST_RETURNED,
      pages: await this.pageService.findPages(),
    };
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findPage(
    @Param('id') id: number,
  ): Promise<{ message: string; page: Page }> {
    return {
      message: PageResponseMessage.PAGE_RETURNED,
      page: await this.pageService.findPageById(id),
    };
  }
}
