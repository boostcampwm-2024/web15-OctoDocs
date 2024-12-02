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
import { User } from './user/user.entity';
import { Workspace } from './workspace/workspace.entity';
import { Role } from './role/role.entity';
import { YjsModule } from './yjs/yjs.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { RoleModule } from './role/role.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedLockModule } from './red-lock/red-lock.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', 'frontend', 'dist'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '..', '.env'), // * nest 디렉터리 기준
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({

        // type: 'sqlite',
        // database: 'db.sqlite',
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Node, Page, Edge, User, Workspace, Role],
        logging: true,
        synchronize: true,
      }),
    }),
    NodeModule,
    PageModule,
    EdgeModule,
    YjsModule,
    UploadModule,
    AuthModule,
    UserModule,
    WorkspaceModule,
    RoleModule,
    TasksModule,
    RedLockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
