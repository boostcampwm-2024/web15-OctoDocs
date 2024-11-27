import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
  }

  generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      expiresIn: '28d',
    });
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      // refreshToken을 검증한다
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // 새로운 accessToken을 발급한다
      return this.generateAccessToken({ sub: decoded.sub });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
