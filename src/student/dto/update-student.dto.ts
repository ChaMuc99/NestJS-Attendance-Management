// src/student/dto/update-student.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
  student_name?: string;
  user?: {
    user_name?: string;
    user_dateofbirth?: Date;
    user_gender?: string;
    user_phone?: string;
    user_email?: string;
  };

}
