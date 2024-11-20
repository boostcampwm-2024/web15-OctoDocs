import { Injectable } from '@nestjs/common';
import { UserRepository } from './entities/user.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UserNotFoundException } from 'src/exception/user.exception';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOrCreateUser(dto: CreateUserDto): Promise<User> {
    const { providerId, provider } = dto;

    const user = await this.userRepository.findOne({
      where: { providerId, provider },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
