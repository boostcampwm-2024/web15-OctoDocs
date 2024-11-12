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
import { CreatePageDto } from './dtos/createPage.dto';
import { UpdatePageDto } from './dtos/updatePage.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessageResponseDto } from './dtos/messageResponse.dto';
import { FindPagesResponseDto } from './dtos/findPagesResponse.dto';
import { FindPageResponseDto } from './dtos/findPageResponse.dto';

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
  @ApiResponse({
    type: MessageResponseDto,
  })
  @ApiOperation({ summary: '페이지를 생성하고 노드도 생성합니다.' })
  @ApiBody({
    description: 'post',
    type: CreatePageDto,
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createPage(@Body() body: CreatePageDto): Promise<MessageResponseDto> {
    await this.pageService.createPage(body);
    return {
      message: PageResponseMessage.PAGE_CREATED,
    };
  }

  @ApiResponse({
    type: MessageResponseDto,
  })
  @ApiOperation({
    summary: '페이지를 삭제하고 노드도 삭제합니다. (cascade delete)',
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deletePage(@Param('id') id: number): Promise<MessageResponseDto> {
    await this.pageService.deletePage(id);
    return {
      message: PageResponseMessage.PAGE_DELETED,
    };
  }

  @ApiResponse({
    type: MessageResponseDto,
  })
  @ApiOperation({ summary: '페이지 제목, 내용을 수정합니다.' })
  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async updatePage(
    @Param('id') id: number,
    @Body() body: UpdatePageDto,
  ): Promise<MessageResponseDto> {
    await this.pageService.updatePage(id, body);
    return {
      message: PageResponseMessage.PAGE_UPDATED,
    };
  }

  @ApiResponse({
    type: FindPagesResponseDto,
  })
  @ApiOperation({ summary: '모든 페이지를 가져옵니다.' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findPages(): Promise<FindPagesResponseDto> {
    return {
      message: PageResponseMessage.PAGE_LIST_RETURNED,
      pages: await this.pageService.findPages(),
    };
  }

  @ApiResponse({
    type: FindPageResponseDto,
  })
  @ApiOperation({ summary: '특정 페이지를 가져옵니다.' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findPage(@Param('id') id: number): Promise<FindPageResponseDto> {
    return {
      message: PageResponseMessage.PAGE_RETURNED,
      page: await this.pageService.findPageById(id),
    };
  }
}
