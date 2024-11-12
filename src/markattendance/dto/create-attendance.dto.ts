
import { IsString, IsOptional, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

class StudentDto {
  @IsString()
  student_id: string;

  @IsString()
  student_name: string;
}

class ClassDto {
  @IsString()
  class_id: string;

  @IsString()
  class_name: string;
}

export class CreateAttendanceDto {

  @ValidateNested()
  @Type(() => StudentDto)
  student: StudentDto;

  @ValidateNested()
  @Type(() => ClassDto)
  class: ClassDto;

  @IsDate()
  @Type(() => Date)
  attendance_date: Date;

  @IsString()
  attendance_status: 'present' | 'absent' | 'excuse' | 'late';

  @IsOptional()
  @IsString()
  attendance_note?: string;
}