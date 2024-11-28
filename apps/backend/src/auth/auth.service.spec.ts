import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/user.repository';
import { SignUpDto } from './dtos/signUp.dto';
import { User } from '../user/user.entity';
import { Snowflake } from '@theinternetfolks/snowflake';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('서비스 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(authService).toBeDefined();
  });

  describe('findUser', () => {
    it('id에 해당하는 사용자를 찾아 성공적으로 반환한다.', async () => {
      const dto: SignUpDto = {
        providerId: 'test-provider-id',
        provider: 'naver',
        email: 'test@naver.com',
      };
      const user = new User();
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await authService.findUser(dto);
      expect(result).toEqual(user);
    });

    it('id에 해당하는 사용자가 없을 경우 null을 return한다.', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      const dto: SignUpDto = {
        providerId: 'unknown-id',
        provider: 'naver',
        email: 'unknown@naver.com',
      };

      const result = await authService.findUser(dto);
      expect(result).toBeNull();
    });
  });

  describe('signUp', () => {
    it('사용자를 성공적으로 생성한다', async () => {
      const dto: SignUpDto = {
        providerId: 'new-provider-id',
        provider: 'naver',
        email: 'new@naver.com',
      };
      const generatedSnowflakeId = Snowflake.generate(); // Snowflake.generate()의 mock 값을 준비
      const newDate = new Date();
      const createdUser = {
        providerId: dto.providerId,
        provider: dto.provider,
        email: dto.email,
        snowflakeId: generatedSnowflakeId,
      };
      const savedUser = {
        providerId: dto.providerId,
        provider: dto.provider,
        email: dto.email,
        snowflakeId: generatedSnowflakeId,
        id: 1,
        createdAt: newDate,
      };

      jest.spyOn(Snowflake, 'generate').mockReturnValue(generatedSnowflakeId);
      jest.spyOn(userRepository, 'create').mockReturnValue(createdUser as User);
      jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser as User);

      const result = await authService.signUp(dto);

      // Then
      expect(result).toEqual(savedUser); // 반환된 값이 예상된 저장된 사용자와 동일
      expect(Snowflake.generate).toHaveBeenCalled(); // Snowflake.generate 호출 확인
      expect(userRepository.create).toHaveBeenCalledWith({
        ...dto,
        snowflakeId: generatedSnowflakeId,
      });
      expect(userRepository.save).toHaveBeenCalledWith(createdUser);
    });
  });
});
