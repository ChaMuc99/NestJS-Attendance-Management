// src/student/dto/create-student.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  student_name: string;

  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  class_id: string;

  @IsNotEmpty()
  @IsString()
  parent_id: string;
}
