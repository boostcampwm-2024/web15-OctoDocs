import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { ConfigModule } from '@nestjs/config';
import { s3ClientProvider } from './s3-client.provider';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [UploadService, s3ClientProvider],
  exports: [UploadService],
})
export class UploadModule {}
