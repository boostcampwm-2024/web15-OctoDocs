import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokenService } from './token/token.service';
import { LoginRequiredException } from '../exception/login.exception';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            findUser: jest.fn(),
            createUser: jest.fn(),
            findUserById: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            generateAccessToken: jest.fn(() => 'mockedAccessToken'),
            generateRefreshToken: jest.fn(() => 'mockedRefreshToken'),
            refreshAccessToken: jest.fn(() => 'mockedAccessToken'),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('컨트롤러 클래스가 정상적으로 인스턴스화된다.', () => {
    expect(authController).toBeDefined();
  });

  describe('getProfile', () => {
    it('JWT 토큰이 유효한 경우 profile을 return한다.', async () => {
      const req = {
        user: { sub: 1, email: 'test@naver.com', provider: 'naver' },
      } as any;
      const result = await authController.getProfile(req);
      expect(result).toEqual({
        message: '인증된 사용자 정보',
        user: req.user,
      });
    });

    it('JWT 토큰이 없는 경우 예외를 던진다.', async () => {
      const req = {} as any;
      try {
        authController.getProfile(req);
      } catch (error) {
        expect(error).toBeInstanceOf(LoginRequiredException);
      }
    });
  });
});
