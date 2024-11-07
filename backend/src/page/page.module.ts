import { Module, forwardRef } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './page.entity';
import { PageRepository } from './page.repository';
import { NodeModule } from '../node/node.module';

@Module({
  imports: [TypeOrmModule.forFeature([Page]), forwardRef(() => NodeModule)],
  controllers: [PageController],
  providers: [PageService, PageRepository],
  exports: [PageService],
})
export class PageModule {}
