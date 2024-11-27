import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

const HOUR = 2 * 60 * 60;
const THREE_MONTHS = 3 * 30 * 24 * 60 * 60;

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, {
      expiresIn: HOUR,
    });
  }

  generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      expiresIn: THREE_MONTHS,
    });
  }

  // 후에 DB 로직 (지금은 refreshToken이 DB로 관리 X)
  // 추가될 때를 위해 일단 비동기 선언
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

  clearCookies(response: Response) {
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
}
