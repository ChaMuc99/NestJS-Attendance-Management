import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateTeacherDto {
  @IsNotEmpty()
  @IsString()
  teacher_id: string;

  @IsNotEmpty()
  @IsString()
  teacher_name: string;

  @IsNotEmpty()
  @IsNumber() // Ensure this is a number
  user_id: number; // Ensure this matches the Teacher entity

  @IsNotEmpty()
  @IsString()
  teacher_department: string;
}
  