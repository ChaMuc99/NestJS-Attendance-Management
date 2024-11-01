// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  user_name: string;

  @IsEmail()
  user_email: string;

  @IsNotEmpty()
  user_password: string;

  @IsNotEmpty()
  user_dateofbirth: Date;

  @IsNotEmpty()
  user_gender: string;

  @IsNotEmpty()
  user_phone: string;

  role: string;
}
