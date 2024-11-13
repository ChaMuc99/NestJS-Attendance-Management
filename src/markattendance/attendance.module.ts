import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Attendance } from '../markattendance/entities/attendance.entities';
import { Student } from '../student/entities/student.entity';
import { Class } from '../class/entities/class.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, Student, Class, Teacher]),
    UsersModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
