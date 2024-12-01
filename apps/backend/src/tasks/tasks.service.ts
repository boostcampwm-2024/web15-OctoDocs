import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '../redis/redis.service';
import { PageService } from '../page/page.service';
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly redisService: RedisService,
    private readonly pageService: PageService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.logger.log('스케줄러 시작');
    // 시작 시간
    const startTime = performance.now();
    const keys = await this.redisService.getAllKeys('page:*');
    Promise.all(
      keys.map(async (key) => {
        const { title, content } = await this.redisService.get(key);
        const pageId = parseInt(key.split(':')[1]);
        if (title === null) {
          const jsonContent = JSON.parse(content);
          await this.pageService.updatePage(pageId, {
            content: jsonContent,
          });
        } else if (content === null) {
          await this.pageService.updatePage(pageId, {
            title,
          });
        } else {
          const jsonContent = JSON.parse(content);
          await this.pageService.updatePage(pageId, {
            title,
            content: jsonContent,
          });
          await this.redisService.delete(key);
        }
      }),
    )
      .then(() => {
        const endTime = performance.now();
        this.logger.log(`갱신 개수 : ${keys.length}개`);
        this.logger.log(`실행 시간 : ${(endTime - startTime) / 1000}초`);
      })
      .catch((err) => {
        this.logger.error(err);
      });
    // scan stream을 가져온다.
    // const stream = this.redisService.createStream();
    // let totalCount = 0;
    // stream.on('data', (keys) => {
    //   console.log(keys);
    //   totalCount += keys.length;
    //   stream.pause();
    //   Promise.all(
    //     keys.map(async (key) => {
    //       const { title, content } = await this.redisService.get(key);
    //       if (title === null) {
    //         const jsonContent = JSON.parse(content);
    //         await this.pageService.updatePage(parseInt(key), {
    //           content: jsonContent,
    //         });
    //       } else if (content === null) {
    //         await this.pageService.updatePage(parseInt(key), {
    //           title,
    //         });
    //       } else {
    //         const jsonContent = JSON.parse(content);
    //         await this.pageService.updatePage(parseInt(key), {
    //           title,
    //           content: jsonContent,
    //         });
    //         await this.redisService.delete(key);
    //       }
    //     }),
    //   )
    //     .then(() => {
    //       stream.resume();
    //     })
    //     .catch((err) => {
    //       this.logger.error(err);
    //       stream.resume();
    //     });
    // });
    // stream.on('end', () => {
    //   const endTime = performance.now();
    //   this.logger.log(`갱신 개수 : ${totalCount}개`);
    //   this.logger.log(`실행 시간 : ${(endTime - startTime) / 1000}초`);
    // });
  }
}
