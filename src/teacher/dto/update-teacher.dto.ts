import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateTeacherDto {
  @IsOptional()
  @IsString()
  teacher_id?: string;

  @IsOptional()
  @IsString()
  teacher_name?: string;

  @IsOptional()
  @IsString()
  teacher_department: string;
}
