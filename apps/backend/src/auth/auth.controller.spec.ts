import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { InvalidTokenException } from '../exception/invalid.exception';
// import { LoginRequiredException } from '../exception/login.exception';

// TODO: 테스트 코드 개선
describe('AuthController', () => {
  let authController: AuthController;
  // let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        {
          provide: AuthService,
          useValue: {
            findUser: jest.fn(),
            createUser: jest.fn(),
            findUserById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
            verify: jest.fn((token: string) => {
              if (token === 'invalid-token') {
                throw new InvalidTokenException();
              }
              return { sub: 1, provider: 'naver' };
            }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    // authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
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

    // it('JWT 토큰이 유효가지 않은 경우 InvalidTokenException을 throw한다.', async () => {
    //   const req = {
    //     headers: { authorization: 'Bearer invalid-token' },
    //     user: undefined,
    //   } as any;
    //   try {
    //     await authController.getProfile(req);
    //   } catch (error) {
    //     expect(error).toBeInstanceOf(InvalidTokenException);
    //   }
    // });

    // it('JWT 토큰이 없는 경우 LoginRequiredException을 throw한다.', async () => {
    //   const req = { headers: {}, user: undefined } as any;
    //   try {
    //     await authController.getProfile(req);
    //   } catch (error) {
    //     expect(error).toBeInstanceOf(LoginRequiredException);
    //   }
    // });
  });

  describe('refreshAccessToken', () => {
    it('refresh token이 유효한 경우 access token을 성공적으로 발급한다.', async () => {
      jest
        .spyOn(jwtService, 'verify')
        .mockReturnValue({ sub: 1, provider: 'naver' });
      const req = { body: { refreshToken: 'valid-refresh-token' } } as any;
      const res = {
        cookie: jest.fn(),
        json: jest.fn(),
      } as any;

      await authController.refreshAccessToken(req, res);
      expect(res.cookie).toHaveBeenCalledWith('accessToken', 'test-token', {
        httpOnly: true,
        maxAge: 3600000,
      });
      expect(res.json).toHaveBeenCalledWith({
        message: '새로운 Access Token 발급 성공',
      });
    });
  });
});
