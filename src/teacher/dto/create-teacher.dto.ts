// src/teacher/dto/create-teacher.dto.ts
import { IsString, IsDate, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  teacher_id: string;

  @IsString()
  teacher_name: string;

  @IsString()
  teacher_department: string;

  // User-related fields

  @IsNotEmpty()
 
  user_id: number;

  @IsString()
  user_name: string;

  @IsDate()
  user_dateofbirth: Date;

  @IsString()
  user_gender: string;

  @IsString()
  user_phone: string;

  @IsEmail()
  user_email: string;

  @IsString()
  user_password: string;
}
