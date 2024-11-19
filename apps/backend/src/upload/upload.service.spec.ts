import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3_CLIENT } from './s3-client.provider';

describe('UploadService', () => {
  let service: UploadService;
  let s3Client: jest.Mocked<S3Client>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: S3_CLIENT,
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    s3Client = module.get(S3_CLIENT);
    configService = module.get(ConfigService);
  });

  it('서비스 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImageToCloud', () => {
    it('이미지를 성공적으로 업로드하고 URL을 반환한다.', async () => {
      // Given
      const mockFile = {
        originalname: 'test.jpg',
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const mockBucketName = 'test-bucket';
      const mockEndpoint = 'https://test-endpoint';

      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce(mockBucketName) // CLOUD_BUCKET_NAME
        .mockReturnValueOnce(mockEndpoint) // CLOUD_ENDPOINT
        .mockReturnValueOnce(mockBucketName); // CLOUD_BUCKET_NAME again

      jest.spyOn(s3Client, 'send').mockResolvedValue({} as never);

      // Mock Date.now()
      const mockDate = 1234567890;
      jest.spyOn(Date, 'now').mockReturnValue(mockDate);

      // When
      const result = await service.uploadImageToCloud(mockFile);

      // Then
      expect(s3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));

      const expectedUrl = `${mockEndpoint}/${mockBucketName}/uploads/${mockDate}-${mockFile.originalname}`;
      expect(result).toBe(expectedUrl);

      const putObjectCommand = (s3Client.send as jest.Mock).mock.calls[0][0];
      expect(putObjectCommand.input).toEqual({
        Bucket: mockBucketName,
        Key: `uploads/${mockDate}-${mockFile.originalname}`,
        Body: mockFile.buffer,
        ContentType: mockFile.mimetype,
        ACL: 'public-read',
      });
    });

    it('S3 업로드 실패 시 에러를 전파한다.', async () => {
      // Given
      const mockFile = {
        originalname: 'test.jpg',
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const mockError = new Error('Upload failed');
      jest.spyOn(s3Client, 'send').mockRejectedValue(mockError as never);

      // When & Then
      await expect(service.uploadImageToCloud(mockFile)).rejects.toThrow(
        mockError,
      );
    });
  });
});
