// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>, // Inject the User repository
    ) {}

    async getAllUsers(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async getUserById(id: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async createUser(user: User): Promise<User> {
        return this.usersRepository.save(user);
    }

    async updateUser(id: string, updatedUser: User): Promise<User | undefined> {
        await this.usersRepository.update(id, updatedUser);
        return this.getUserById(id); // Return the updated user
    }

    async deleteUser(id: string): Promise<{ deleted: boolean }> {
        await this.usersRepository.delete(id);
        return { deleted: true };
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { user_email: email } });
    }
}
