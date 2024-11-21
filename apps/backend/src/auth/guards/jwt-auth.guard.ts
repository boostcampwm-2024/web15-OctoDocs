import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequiredException } from '../../exception/login.exception';
import { InvalidTokenException } from 'src/exception/invalid.exception';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      console.log('Authorization header missing');
      throw new LoginRequiredException();
    }

    const token = authorizationHeader.split(' ')[1];

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = decodedToken;
      return true;
    } catch (error) {
      console.log('Invalid token');
      throw new InvalidTokenException();
    }
  }
}
