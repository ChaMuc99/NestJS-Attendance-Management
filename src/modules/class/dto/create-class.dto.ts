// src/class/dto/create-class.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  @IsString()
  class_id: string;
}
