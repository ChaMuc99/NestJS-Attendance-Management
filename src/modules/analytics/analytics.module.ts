import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../markattendance/entities/attendance.entities';
import { Parent } from '../parent/entities/parent.entity';
import { Student } from '../student/entities/student.entity';
import { Class } from '../class/entities/class.entity';
import { User } from '../users/entities/user.entity';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, Parent, Student, Class, User]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
