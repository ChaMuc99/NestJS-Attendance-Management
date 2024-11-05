// src/student/dto/update-student.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  student_name?: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  class_id: string;

  @IsOptional()
  @IsString()
  parent_id?: string;
}
