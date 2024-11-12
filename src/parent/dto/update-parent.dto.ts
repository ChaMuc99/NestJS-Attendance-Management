// src/parent/dto/update-parent.dto.ts
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateUserDto {
  @IsOptional()
  @IsString()
  user_name?: string;

  @IsOptional()
  @IsString()
  user_dateofbirth?: Date;

  @IsOptional()
  @IsString()
  user_gender?: string;

  @IsOptional()
  @IsString()
  user_phone?: string;

  @IsOptional() 
  @IsString()
  user_email?: string;

  @IsOptional()
  @IsString()
  user_password?: string;

  @IsOptional()
  @IsString()
  role?: string;
}

class UpdateParentInfoDto {
  @IsOptional()
  @IsString()
  parent_id?: string;

  @IsOptional()
  @IsString()
  parent_name?: string;
}

export class UpdateParentDto {
  @ValidateNested()
  @Type(() => UpdateParentInfoDto)
  @IsOptional()
  parent?: UpdateParentInfoDto;

  @ValidateNested()
  @Type(() => UpdateUserDto)
  @IsOptional()
  user?: UpdateUserDto;
}
