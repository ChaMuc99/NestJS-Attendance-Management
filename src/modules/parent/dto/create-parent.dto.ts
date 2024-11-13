// src/parent/dto/create-parent.dto.ts
import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UserDto {
  @IsString()
  user_name: string;

  @IsString()
  user_dateofbirth: string;

  @IsString()
  user_gender: string;

  @IsString()
  user_phone: string;

  @IsString()
  user_email: string;

  @IsString()
  user_password: string;

  @IsString()
  role: string;
}

class ParentDetailsDto {
  @IsString()
  parent_id: string;

  @IsString()
  parent_name: string;
}

export class CreateParentDto {
  @ValidateNested()
  @Type(() => ParentDetailsDto)
  parent: ParentDetailsDto;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}
