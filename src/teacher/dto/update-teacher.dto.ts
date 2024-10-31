import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateTeacherDto {
  @IsOptional()
  @IsString()
  teacher_id?: string;

  @IsOptional()
  @IsString()
  teacher_name?: string;

  @IsOptional()
  @IsNumber() // Ensure this is a number
  user_id?: number; // Change to number

  @IsOptional()
  @IsString()
  teacher_department?: string;
}
