import { S3Client } from '@aws-sdk/client-s3';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const S3_CLIENT = 'S3_CLIENT';

export const s3ClientProvider: Provider = {
  provide: S3_CLIENT,
  useFactory: (configService: ConfigService) => {
    return new S3Client({
      region: configService.get('CLOUD_REGION'),
      endpoint: configService.get('CLOUD_ENDPOINT'),
      credentials: {
        accessKeyId: configService.get('CLOUD_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('CLOUD_SECRET_ACCESS_KEY'),
      },
    });
  },
  inject: [ConfigService],
};
