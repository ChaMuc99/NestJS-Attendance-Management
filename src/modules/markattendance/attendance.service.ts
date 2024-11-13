import {
  Injectable,
  Inject,
  UnauthorizedException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entities';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Student } from '../student/entities/student.entity';
import { Class } from '../class/entities/class.entity';
import { UsersService } from 'src/modules/users/users.service';
import { TeacherService } from 'src/modules/teacher/teacher.service';
import {
  transformAttendance,
  TransformedAttendance,
} from '../../shared/transformer/attendance.transform';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Teacher } from 'src/modules/teacher/entities/teacher.entity';

@Injectable({ scope: Scope.REQUEST })
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    private usersService: UsersService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async createAttendance(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<TransformedAttendance> {
    const user = this.request.user as any;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Find student
    const student = await this.studentRepository.findOne({
      where: { student_id: createAttendanceDto.student.student_id },
    });
    if (!student) {
      throw new NotFoundException(
        `Student with ID ${createAttendanceDto.student.student_id} not found`,
      );
    }

    // Find class
    const classEntity = await this.classRepository.findOne({
      where: { class_id: createAttendanceDto.class.class_id },
    });
    if (!classEntity) {
      throw new NotFoundException(
        `Class with ID ${createAttendanceDto.class.class_id} not found`,
      );
    }

    // Create base attendance object
    const attendance = this.attendanceRepository.create({
      ...createAttendanceDto,
      student,
      class: classEntity,
      created_by: user.id,
      updated_by: user.id,
    });

    // Handle different user roles
    if (user.role === 'teacher') {
      const teacher = await this.teacherRepository.findOne({
        where: {
          user: { id: user.id },
        },
        relations: ['user'],
      });

      if (!teacher) {
        throw new NotFoundException(
          `Teacher record not found for user ID ${user.id}`,
        );
      }
      attendance.marked_by_teacher = teacher;
    } else if (user.role === 'admin') {
      const adminUser = await this.usersService.getUserById(user.id);
      attendance.marked_by_user = adminUser;
    }

    const savedAttendance = await this.attendanceRepository.save(attendance);
    return transformAttendance(savedAttendance);
  }

  //-----------------------------------Get All Attendance-----------------------------------//

  async getAllAttendance(): Promise<TransformedAttendance[]> {
    const allAttendance = await this.attendanceRepository.find({
      relations: ['student', 'class', 'marked_by_teacher', 'marked_by_user'],
    });

    if (!allAttendance || allAttendance.length === 0) {
      throw new NotFoundException('No attendance records found');
    }

    return allAttendance.map((attendance) => transformAttendance(attendance));
  }
  //-----------------------------------Get Attendance by ID-----------------------------------//

  async getAttendanceById(id: number): Promise<TransformedAttendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { attendance_id: id.toString() },
      relations: ['student', 'class', 'marked_by_teacher', 'marked_by_user'],
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    return transformAttendance(attendance);
  }
  //-----------------------------------Update Attendance by ID-----------------------------------//

  async updateAttendance(
    id: number,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<TransformedAttendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { attendance_id: id.toString() },
      relations: ['student', 'class', 'marked_by_teacher', 'marked_by_user'],
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    const user = this.request.user as any;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Only update the allowed fields
    attendance.attendance_date = new Date(updateAttendanceDto.attendance_date);
    attendance.attendance_status = updateAttendanceDto.attendance_status;
    attendance.attendance_note = updateAttendanceDto.attendance_note;
    attendance.updated_by = user.id;

    const updatedAttendance = await this.attendanceRepository.save(attendance);
    return transformAttendance(updatedAttendance);
  }

  //-----------------------------------Delete Attendance by ID-----------------------------------//

  async deleteAttendance(
    id: number,
  ): Promise<{ status: string; message: string }> {
    const result = await this.attendanceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    } else {
      return {
        status: 'success',
        message: 'Attendance deleted successfully',
      };
    }
  }

  //-----------------------------------Get Attendance by Class ID-----------------------------------//

  async getAttendanceByClassId(
    classId: number,
  ): Promise<TransformedAttendance[]> {
    const attendance = await this.attendanceRepository.find({
      where: { class: { class_id: classId.toString() } },
      relations: ['student', 'class', 'marked_by_teacher', 'marked_by_user'],
    });
    if (!attendance || attendance.length === 0) {
      throw new NotFoundException(
        `No attendance records found for class with ID ${classId}`,
      );
    }

    return attendance.map((attendance) => transformAttendance(attendance));
  }

  //-----------------------------------Get All Students in a Class in a Specific Date-----------------------------------//
  async getStudentsByAttendanceStatus(
    class_id: string,
    attendance_date: Date,
    attendance_status: string,
  ): Promise<{ message: string; data: TransformedAttendance[] }> {
    const attendances = await this.attendanceRepository.find({
      where: {
        class: { class_id },
        attendance_date,
        attendance_status,
      },
      relations: ['student', 'class', 'marked_by_teacher', 'marked_by_user'],
    });

    const transformedAttendances = attendances.map((attendance) =>
      transformAttendance(attendance),
    );

    const className = attendances[0]?.class?.class_name || 'Unknown';
    const formattedDate = new Date(attendance_date).toLocaleDateString();

    return {
      message: `Total ${transformedAttendances.length} students ${attendance_status} in Class ${className} on ${formattedDate}`,
      data: transformedAttendances,
    };
  }
}
