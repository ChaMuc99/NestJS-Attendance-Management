import { IsString, IsOptional, IsDateString, IsIn } from 'class-validator';

export class UpdateAttendanceDto {
  @IsDateString()
  attendance_date: string;

  @IsString()
  @IsIn(['present', 'absent', 'late']) // Add any other valid statuses
  attendance_status: string;

  @IsString()
  @IsOptional()
  attendance_note?: string;
}