import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { SignUpDto } from './dto/signUp.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUser(dto: SignUpDto): Promise<User | null> {
    const { providerId, provider } = dto;

    const user = await this.userRepository.findOne({
      where: { providerId, provider },
    });

    return user;
  }

  async signUp(dto: SignUpDto): Promise<User> {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }
}
