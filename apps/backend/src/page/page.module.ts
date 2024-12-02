import { Module, forwardRef } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './page.entity';
import { PageRepository } from './page.repository';
import { NodeModule } from '../node/node.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { RedLockModule } from '../red-lock/red-lock.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Page]),
    forwardRef(() => NodeModule),
    WorkspaceModule,
    RedLockModule,
  ],
  controllers: [PageController],
  providers: [PageService, PageRepository],
  exports: [PageService, PageRepository],
})
export class PageModule {}
