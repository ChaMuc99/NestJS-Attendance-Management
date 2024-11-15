import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Attendance } from '../markattendance/entities/attendance.entities';
import { Parent } from '../parent/entities/parent.entity';
import { Student } from '../student/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { Class } from '../class/entities/class.entity';
import { AnalyticsTransformer } from '../../shared/transformer/analytics.transformer';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Parent)
    private readonly parentRepository: Repository<Parent>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  //---------------------------------------------Get Parent Children Attendance---------------------------------------------//

  async getParentChildrenAttendance(userId: string) {
    console.log('1. Starting getParentChildrenAttendance with userId:', userId);

    const parent = await this.parentRepository
      .createQueryBuilder('parent')
      .leftJoinAndSelect('parent.user', 'user')
      .leftJoinAndSelect('parent.students', 'students')
      .leftJoinAndSelect('students.class', 'class')
      .where('user.id = :userId', { userId })
      .getOne();

    console.log('2. Query result:', JSON.stringify(parent, null, 2));

    if (!parent) {
      console.log('3. No parent found for userId:', userId);
      throw new NotFoundException('Parent record not found');
    }

    console.log(
      '4. Parent students:',
      JSON.stringify(parent.students, null, 2),
    );

    const childrenAttendance = new Map<string, Attendance[]>();

    for (const student of parent.students) {
      console.log('5. Processing student:', student.student_id);

      const attendanceRecords = await this.attendanceRepository.find({
        where: { student: { student_id: student.student_id } },
        order: { attendance_date: 'DESC' },
      });

      console.log('6. Found attendance records:', attendanceRecords.length);
      childrenAttendance.set(student.student_id, attendanceRecords);
    }

    const result = AnalyticsTransformer.transformParentAttendanceReport(
      parent,
      childrenAttendance,
    );
    console.log(
      '7. Final transformed result:',
      JSON.stringify(result, null, 2),
    );

    return result;
  }

  //---------------------------------------------Get Date Range Attendance Summary---------------------------------------------//

  async getDateRangeAttendanceSummary(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const parent = await this.parentRepository
      .createQueryBuilder('parent')
      .leftJoinAndSelect('parent.user', 'user')
      .leftJoinAndSelect('parent.students', 'students')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!parent) {
      throw new NotFoundException('Parent record not found');
    }

    const summaries = await Promise.all(
      parent.students.map(async (student) => {
        const attendanceRecords = await this.attendanceRepository
          .createQueryBuilder('attendance')
          .where('attendance.student_id = :studentId', {
            studentId: student.student_id,
          })
          .andWhere(
            'attendance.attendance_date BETWEEN :startDate AND :endDate',
            {
              startDate,
              endDate,
            },
          )
          .getMany();

        return {
          student_id: student.student_id,
          student_name: student.student_name,
          late: attendanceRecords.filter((r) => r.attendance_status === 'late')
            .length,
          absent: attendanceRecords.filter(
            (r) => r.attendance_status === 'absent',
          ).length,
          excuse: attendanceRecords.filter(
            (r) => r.attendance_status === 'excuse',
          ).length,
          period_start: startDate,
          period_end: endDate,
        };
      }),
    );

    return {
      parent_id: parent.parent_id,
      parent_name: parent.user.user_name,
      children_summaries: summaries,
    };
  }

  //--------------------------Get Class Attendance Summary in a month---------------------------------------------//
  
  async getClassAttendanceSummary(classId: string, date: Date) {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // Get all attendance records for the class in the given month
    const attendanceRecords = await this.attendanceRepository.find({
      where: {
        class: { class_id: classId },
        attendance_date: Between(startOfMonth, endOfMonth),
      },
      relations: ['student', 'class'],
    });

    // Group records by student
    const studentAttendanceMap = new Map();
    attendanceRecords.forEach((record) => {
      if (!studentAttendanceMap.has(record.student.student_id)) {
        studentAttendanceMap.set(record.student.student_id, {
          student_id: record.student.student_id,
          student_name: record.student.student_name,
          present: 0,
          absent: 0,
          late: 0,
        });
      }

      const stats = studentAttendanceMap.get(record.student.student_id);
      stats[record.attendance_status.toLowerCase()]++;
    });

    return {
      class_name: attendanceRecords[0]?.class.class_name || '',
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      students: Array.from(studentAttendanceMap.values()),
    };
  }
}
