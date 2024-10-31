// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity'; // Import the User entity

@Module({
    imports: [TypeOrmModule.forFeature([User])], // Register the User entity
    providers: [UsersService],
    exports: [UsersService], // Export the service to be used in other modules
})
export class UsersModule {}
