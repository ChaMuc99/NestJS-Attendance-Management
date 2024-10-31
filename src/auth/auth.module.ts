// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'defaultSecret', // Use environment variable for security
            signOptions: { expiresIn: '5h' }, // Adjust expiration time as needed
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
