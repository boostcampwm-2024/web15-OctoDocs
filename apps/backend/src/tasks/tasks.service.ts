import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '../redis/redis.service';
import { PageService } from '../page/page.service';
import { PageNotFoundException } from 'src/exception/page.exception';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly redisService: RedisService,
    private readonly pageService: PageService,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async handleCron() {
    console.log(await this.redisService.getAllKeys());
    const keys = await this.redisService.getAllKeys();
    const pages = [];
    this.logger.log('스케줄러 시작');
    for await (const key of keys) {
      const { title, content } = await this.redisService.get(key);
      const jsonContent = JSON.parse(content);
      pages.push({
        id: key,
        title,
        content: jsonContent,
        version: 1,
      });
      this.pageService.updatePage(parseInt(key), {
        title,
        content: jsonContent,
      });
      this.logger.log('데이터베이스 갱신');
    }
    try {
      this.pageService.updateBulkPage(pages);
    } catch (exception) {
      if (exception instanceof PageNotFoundException) {
      }
    }
  }
}
