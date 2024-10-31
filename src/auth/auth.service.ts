// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.user_password)) {
            return user;
        }
        return null; 
    }

    async login(user: User) {
        const payload = { username: user.user_name, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(userData: Partial<User>): Promise<User> {
        // Hash the user's password before saving
        if (userData.user_password) {
            userData.user_password = await bcrypt.hash(userData.user_password, 10);
        }
        const newUser = this.userService.createUser(userData as User);
        return newUser;
    }
}
