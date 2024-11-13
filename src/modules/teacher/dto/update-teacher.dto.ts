import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateTeacherDto {
  teacher_name?: string;
  teacher_department?: string;
  user_name?: string;
  user_email?: string;
  user_dateofbirth?: Date;
  user_gender?: string;
  user_phone?: string;
}
