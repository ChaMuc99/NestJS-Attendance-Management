import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { TransformedAttendance } from '../../shared/transformer/attendance.transform';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  //----------------------------------------Create Attendance-----------------------------------//
  @Post()
  @Roles('teacher', 'admin')
  async createAttendance(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.createAttendance(createAttendanceDto);
  }

  //----------------------------------------Get All Attendance-----------------------------------//
  @Get()
  @Roles('teacher', 'admin')
  async getAllAttendance() {
    return this.attendanceService.getAllAttendance();
  }

  //----------------------------------------Get Attendance by ID-----------------------------------//
  @Get(':id')
  @Roles('teacher', 'admin')
  async getAttendanceById(@Param('id') id: number) {
    return this.attendanceService.getAttendanceById(id);
  }

  //----------------------------------------Update Attendance by ID-----------------------------------//

  @Put(':id')
  @Roles('teacher', 'admin')
  async updateAttendance(
    @Param('id') id: number,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.updateAttendance(id, updateAttendanceDto);
  }

  //----------------------------------------Delete Attendance by ID-----------------------------------//
  @Delete(':id')
  @Roles('teacher', 'admin')
  async deleteAttendance(@Param('id') id: number) {
    return this.attendanceService.deleteAttendance(id);
  }

  //----------------------------------------Get Students by Attendance Status-----------------------------------//
  @Post('students-by-status')
  async getStudentsByAttendanceStatus(
    @Body()
    filterDto: {
      class_id: string;
      attendance_date: Date;
      attendance_status: string;
    },
  ): Promise<{ message: string; data: TransformedAttendance[] }> {
    const { class_id, attendance_date, attendance_status } = filterDto;

    const result = await this.attendanceService.getStudentsByAttendanceStatus(
      class_id,
      new Date(attendance_date),
      attendance_status,
    );

    return result;
  }
  //----------------------------------------Get Attendance by Class ID-----------------------------------//

  @Get('class/:classId')
  @Roles('teacher', 'admin')
  async getAttendanceByClassId(@Param('classId') classId: number) {
    return this.attendanceService.getAttendanceByClassId(classId);
  }
}
