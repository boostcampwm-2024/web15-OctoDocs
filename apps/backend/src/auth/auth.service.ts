import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { SignUpDto } from './dtos/signUp.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserNotFoundException } from '../exception/user.exception';
import { Snowflake } from '@theinternetfolks/snowflake';


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
    const user = this.userRepository.create({
      ...dto,
      snowflakeId: Snowflake.generate(),
    });
    return this.userRepository.save(user);
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }
  async updateUser(id: number, dto: UpdateUserDto) {
    // 유저를 찾는다.
    const findUser = await this.userRepository.findOneBy({ id });

    // 유저가 없으면 오류
    if (!findUser) {
      throw new UserNotFoundException();
    }

    // 유저 갱신
    const newPage = Object.assign({}, findUser, dto);
    await this.userRepository.save(newPage);
  }
}
