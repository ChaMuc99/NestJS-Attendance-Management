// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  //---------------------------------------------------------------Validate User-----------------------------------------------------//
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return null;
    }

    // Use bcrypt for secure password comparison
    if (user.user_password !== password) {
      console.log('Password does not match');
      return null;
    }

    return user;
  }
  //-------------------------------------------------------------Login-----------------------------------------------------//
  async login(user: User) {
    const payload = {
      email: user.user_email,
      sub: user.id,
      role: user.role,
    };
    console.log('Login Payload:', payload);
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.user_email,
        role: user.role,
      },
    };
  }
}
