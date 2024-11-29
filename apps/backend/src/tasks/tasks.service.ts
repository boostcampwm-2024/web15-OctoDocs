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

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    this.logger.log('스케줄러 시작');
    // 시작 시간
    const startTime = performance.now();

    // redis의 모든 값을 가져와서 database에 저장
    const keys = await this.redisService.getAllKeys();
    const pages = [];
    for await (const key of keys) {
      const { title, content } = await this.redisService.get(key);
      const jsonContent = JSON.parse(content);
      Object.assign({
        id: parseInt(key),
      });
      pages.push({
        id: parseInt(key),
        title,
        content: jsonContent,
        version: 1,
      });
      // this.pageService.updatePage(parseInt(key), {
      //   title,
      //   content: jsonContent,
      // });
      // this.logger.log('데이터베이스 갱신');
    }
    await this.pageService.updateBulkPage(pages);

    // 끝 시간
    const endTime = performance.now();
    this.logger.log(`갱신 개수 : ${pages.length}개`);
    this.logger.log(`실행 시간 : ${(endTime - startTime) / 1000}초`);
  }
}
