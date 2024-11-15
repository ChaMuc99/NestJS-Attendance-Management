import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.user_password, salt);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      user_password: hashedPassword,
    });
    return await this.usersRepository.save(user);
  }

  async updateUser(id: string, updatedUser: User): Promise<User | undefined> {
    if (updatedUser.user_password) {
      const salt = await bcrypt.genSalt();
      updatedUser.user_password = await bcrypt.hash(updatedUser.user_password, salt);
    }
    await this.usersRepository.update(id, updatedUser);
    return this.getUserById(id);
  }

  async deleteUser(id: string): Promise<{ deleted: boolean }> {
    await this.usersRepository.delete(id);
    return { deleted: true };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { user_email: email },
    });
  }
}
