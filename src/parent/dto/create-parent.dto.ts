// src/parent/dto/create-parent.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class CreateParentDto {
  @IsString()
  parent_id: string;

  @IsString()
  parent_name: string;

  @IsNumber()
  user_id: number;
}
