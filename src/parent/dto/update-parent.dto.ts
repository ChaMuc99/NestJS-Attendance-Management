// src/parent/dto/update-parent.dto.ts
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateParentDto {
  @IsOptional()
  @IsString()
  parent_id?: string;

  @IsOptional()
  @IsString()
  parent_name?: string;

  @IsOptional()
  @IsNumber()
  user_id?: number; // Ensure this matches the Parent entity type
}
