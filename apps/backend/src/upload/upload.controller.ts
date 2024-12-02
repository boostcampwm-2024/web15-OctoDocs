import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { uploadOptions } from './upload.config';
import { ImageUploadResponseDto } from './dtos/imageUploadResponse.dto';

export enum UploadResponseMessage {
  UPLOAD_IMAGE_SUCCESS = '이미지 업로드 성공',
}

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageUploadResponseDto> {
    const result = await this.uploadService.uploadImageToCloud(file);

    return {
      message: UploadResponseMessage.UPLOAD_IMAGE_SUCCESS,
      url: result,
    };
  }
}
