// src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() userData: Partial<User>): Promise<User> {
        return this.authService.register(userData);
    }

    @Post('login')
    async login(@Body() loginData: { email: string; password: string }) {
        const user = await this.authService.validateUser(loginData.email, loginData.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }
}
