import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUser(dto: CreateUserDto): Promise<User | null> {
    const { providerId, provider } = dto;

    const user = await this.userRepository.findOne({
      where: { providerId, provider },
    });

    return user;
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }
}
