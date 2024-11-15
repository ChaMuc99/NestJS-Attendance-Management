import { Type } from 'class-transformer';
import { IsString, IsDate, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';

class UserDto {
  @IsNotEmpty()
  user_id: string;

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

export class CreateTeacherDto {
  @IsString()
  teacher_id: string;

  @IsString()
  teacher_name: string;

  @IsString()
  teacher_department: string;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}
