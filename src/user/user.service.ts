import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.save(dto);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
