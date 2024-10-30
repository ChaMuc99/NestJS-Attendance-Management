// src/parent/dto/create-parent.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateParentDto {
  @IsNotEmpty()
  @IsString()
  parent_name: string;

  @IsNotEmpty()
  @IsString()
  user_id: string;
}
