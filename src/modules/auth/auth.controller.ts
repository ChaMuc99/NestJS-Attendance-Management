// src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //-----------------------------------------------------------------Login-----------------------------------------------------//
  @Post('login')
  async login(@Body() loginDto: { user_email: string; user_password: string }) {
    console.log('Login attempt:', loginDto);

    const user = await this.authService.validateUser(
      loginDto.user_email,
      loginDto.user_password,
    );

    console.log('Validated user:', user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }
}
