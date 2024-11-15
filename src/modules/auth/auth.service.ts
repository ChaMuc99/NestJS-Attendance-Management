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

  async validateUser(email: string, password: string): Promise<any> {
    console.log('Validating user:', email);
    const user = await this.userService.findByEmail(email);
    
    if (user) {
      const isMatch = await bcrypt.compare(password, user.user_password);
      if (isMatch) {
        const { user_password, ...result } = user;
        return result;
      }
    }
    return null;
  }
  
  
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
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
