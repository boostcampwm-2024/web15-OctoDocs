import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NodeModule } from './node/node.module';
import { PageModule } from './page/page.module';
import { EdgeModule } from './edge/edge.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './page/page.entity';
import { Edge } from './edge/edge.entity';
import { Node } from './node/node.entity';
import { YjsModule } from './yjs/yjs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env', // * nest 디렉터리 기준
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('DB_NAME'),
        entities: [Node, Page, Edge],
        logging: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    NodeModule,
    PageModule,
    EdgeModule,
    YjsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
