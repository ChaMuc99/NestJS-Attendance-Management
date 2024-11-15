import {
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import {
  transformAttendance,
  TransformedAttendance,
} from 'src/shared/transformer/attendance.transform';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Repository } from 'typeorm';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entities';
import { Student } from '../student/entities/student.entity';
import { Class } from '../class/entities/class.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { UsersService } from '../users/users.service';
import { REQUEST } from '@nestjs/core';

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

  //--------------------------------------------------validateUser----------------------------------------------------------------------------------------------------//

  private async validateUser() {
    const user = (this.request as any).user;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return user;
  }

  //-----------------------------------------findEntityOrThrow----------------------------------------------------------------------------------------------------//
  private async findEntityOrThrow<T>(
    repository: Repository<T>,
    conditions: any,
    entityName: string,
    idField: string,
  ): Promise<T> {
    const entity = await repository.findOne(conditions);
    if (!entity) {
      throw new NotFoundException(`${entityName} with ID ${idField} not found`);
    }
    return entity;
  }
  ///---------------------------------------------------------------------------------------------------Create Attendance----------------------------------------------------------------------------------------------------//

  async createAttendance(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<TransformedAttendance> {
    const user = await this.validateUser();

    const [student, classEntity] = await Promise.all([
      this.findEntityOrThrow(
        this.studentRepository,
        { where: { student_id: createAttendanceDto.student.student_id } },
        'Student',
        createAttendanceDto.student.student_id,
      ),
      this.findEntityOrThrow(
        this.classRepository,
        { where: { class_id: createAttendanceDto.class.class_id } },
        'Class',
        createAttendanceDto.class.class_id,
      ),
    ]);

    const attendance = this.attendanceRepository.create({
      ...createAttendanceDto,
      student,
      class: classEntity,
      created_by: user.id,
      updated_by: user.id,
    });

    if (user.role === 'teacher') {
      attendance.marked_by_teacher = await this.findEntityOrThrow(
        this.teacherRepository,
        { where: { user: { id: user.id } }, relations: ['user'] },
        'Teacher',
        user.id,
      );
    } else if (user.role === 'admin') {
      attendance.marked_by_user = await this.usersService.getUserById(user.id);
    }

    const savedAttendance = await this.attendanceRepository.save(attendance);
    return transformAttendance(savedAttendance);
  }
  //----------------------------------------------------Get All Attendance----------------------------------------------------------------------------------------------------//

  async getAllAttendance(): Promise<TransformedAttendance[]> {
    const allAttendance = await this.attendanceRepository.find({
      relations: ['student', 'class', 'marked_by_teacher', 'marked_by_user'],
    });

    if (!allAttendance?.length) {
      throw new NotFoundException('No attendance records found');
    }

    return allAttendance.map(transformAttendance);
  }

  //----------------------------------------------------Get Attendance by ID----------------------------------------------------------------------------------------------------//

  async getAttendanceById(id: number): Promise<TransformedAttendance> {
    const attendance = await this.findEntityOrThrow(
      this.attendanceRepository,
      {
        where: { attendance_id: id.toString() },
        relations: ['student', 'class', 'marked_by_teacher', 'marked_by_user'],
      },
      'Attendance',
      id.toString(),
    );
    return transformAttendance(attendance);
  }

  //----------------------------------------------------Update Attendance----------------------------------------------------------------------------------------------------//

  async updateAttendance(
    id: number,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<TransformedAttendance> {
    const [attendance, user] = await Promise.all([
      this.findEntityOrThrow(
        this.attendanceRepository,
        {
          where: { attendance_id: id.toString() },
          relations: [
            'student',
            'class',
            'marked_by_teacher',
            'marked_by_user',
          ],
        },
        'Attendance',
        id.toString(),
      ),
      this.validateUser(),
    ]);

    Object.assign(attendance, {
      attendance_date: new Date(updateAttendanceDto.attendance_date),
      attendance_status: updateAttendanceDto.attendance_status,
      attendance_note: updateAttendanceDto.attendance_note,
      updated_by: user.id,
    });

    const updatedAttendance = await this.attendanceRepository.save(attendance);
    return transformAttendance(updatedAttendance);
  }

  //----------------------------------------------------Delete Attendance----------------------------------------------------------------------------------------------------//

  async deleteAttendance(
    id: number,
  ): Promise<{ status: string; message: string }> {
    const result = await this.attendanceRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    return {
      status: 'success',
      message: 'Attendance deleted successfully',
    };
  }

  //----------------------------------------------------Get Attendance by Class ID----------------------------------------------------------------------------------------------------//

  async getAttendanceByClassId(
    classId: number,
  ): Promise<TransformedAttendance[]> {
    const attendance = await this.attendanceRepository.find({
      where: { class: { class_id: classId.toString() } },
      relations: ['student', 'class', 'marked_by_teacher', 'marked_by_user'],
    });

    if (!attendance?.length) {
      throw new NotFoundException(
        `No attendance records found for class with ID ${classId}`,
      );
    }

    return attendance.map(transformAttendance);
  }

  //----------------------------------------------------Get Students by Attendance Status----------------------------------------------------------------------------------------------------//

  async getStudentsByAttendanceStatus(
    class_id: string,
    attendance_date: Date,
    attendance_status: string,
  ): Promise<{ message: string; data: TransformedAttendance[] }> {
    const attendances = await this.attendanceRepository.find({
      where: { class: { class_id }, attendance_date, attendance_status },
      relations: ['student', 'class', 'marked_by_teacher', 'marked_by_user'],
    });

    const transformedAttendances = attendances.map(transformAttendance);
    const className = attendances[0]?.class?.class_name || 'Unknown';
    const formattedDate = new Date(attendance_date).toLocaleDateString();

    return {
      message: `Total ${transformedAttendances.length} students ${attendance_status} in Class ${className} on ${formattedDate}`,
      data: transformedAttendances,
    };
  }
}
