// src/student/dto/update-student.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
  student_name?: string;

  class?: {
    class_id: string;
    class_name: string;
  };

  parent?: {
    parent_id: string;
    parent_name: string;
    user_email?: string;
    user_dateofbirth?: Date;
    user_gender?: string;
    user_phone?: string;
    user_password?: string;
  };

  user?: {
    user_name: string;
    user_dateofbirth: Date;
    user_gender: string;
    user_phone: string;
    user_email: string;
    user_password: string;
  };
}
