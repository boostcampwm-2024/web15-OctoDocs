import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { YjsModule } from './yjs/yjs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '..', '.env'), // * nest 디렉터리 기준
    }),
    YjsModule,
  ],
})
export class AppModule {}
