// src/student/student.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { User } from '../users/entities/user.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Class } from '../class/entities/class.entity';
import { Parent } from '../parent/entities/parent.entity';
import { StudentTransformer } from './student.transformer';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Class) private classRepository: Repository<Class>,
    @InjectRepository(Parent) private parentRepository: Repository<Parent>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private async findOrCreateClass(classData): Promise<Class> {
    let classEntity = await this.classRepository.findOneBy({
      class_id: classData.class_id,
    });
    if (!classEntity) {
      classEntity = this.classRepository.create({
        class_id: classData.class_id,
        class_name: classData.class_name,
      });
      await this.classRepository.save(classEntity);
    }
    return classEntity;
  }

  private async findOrCreateParent(parentData): Promise<Parent> {
    let parentEntity = await this.parentRepository.findOneBy({
      parent_id: parentData.parent_id,
    });
    if (!parentEntity) {
      const userEntity = await this.findOrCreateUser({
        user_name: parentData.parent_name,
        user_email: parentData.user_email,
        user_dateofbirth: parentData.user_dateofbirth,
        user_gender: parentData.user_gender,
        user_phone: parentData.user_phone,
        user_password: parentData.user_password,
      });

      parentEntity = this.parentRepository.create({
        parent_id: parentData.parent_id,
        parent_name: parentData.parent_name,
        user_id: userEntity.id,
      });
      await this.parentRepository.save(parentEntity);
    }
    return parentEntity;
  }

  private async findOrCreateUser(userData): Promise<User> {
    let userEntity = await this.userRepository.findOne({
      where: { user_email: userData.user_email },
    });

    if (!userEntity) {
      userEntity = this.userRepository.create({
        user_name: userData.user_name,
        user_dateofbirth: userData.user_dateofbirth,
        user_gender: userData.user_gender,
        user_phone: userData.user_phone,
        user_email: userData.user_email,
        user_password: userData.user_password,
        role: 'student',
      });
      await this.userRepository.save(userEntity);
    }
    return userEntity;
  }

  async createStudent(studentData): Promise<Partial<Student>> {
    const classEntity = await this.findOrCreateClass(studentData.class);
    const parentEntity = await this.findOrCreateParent(studentData.parent);
    const userEntity = await this.findOrCreateUser(studentData.user);

    const studentEntity = this.studentRepository.create({
      student_id: studentData.student_id,
      student_name: studentData.student_name,
      class: classEntity,
      parent: parentEntity,
      user: userEntity,
    });

    const savedStudent = await this.studentRepository.save(studentEntity);
    return StudentTransformer.transform(savedStudent);
  }

  async findAll(): Promise<Partial<Student>[]> {
    const students = await this.studentRepository.find({
      relations: ['class', 'parent', 'user'],
      order: {
        student_id: 'ASC',
        created_at: 'DESC',
      },
    });
    return students.map((student) => StudentTransformer.transform(student));
  }

  async findOne(id: string): Promise<Partial<Student>> {
    const student = await this.studentRepository.findOne({
      where: { student_id: id },
      relations: ['class', 'parent', 'user'],
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return StudentTransformer.transform(student);
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Partial<Student>> {
    const existingStudent = await this.studentRepository.findOne({
      where: { student_id: id },
      relations: ['class', 'parent', 'user'],
    });

    if (!existingStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // Update class if provided
    if (updateStudentDto.class) {
      const classEntity = await this.findOrCreateClass(updateStudentDto.class);
      existingStudent.class = classEntity;
    }

    // Update parent if provided
    if (updateStudentDto.parent) {
      const parentEntity = await this.findOrCreateParent(
        updateStudentDto.parent,
      );
      existingStudent.parent = parentEntity;
    }

    // Update user if provided
    if (updateStudentDto.user) {
      const userEntity = await this.findOrCreateUser({
        ...updateStudentDto.user,
        role: 'student',
      });
      existingStudent.user = userEntity;
    }

    // Update basic student properties
    if (updateStudentDto.student_name) {
      existingStudent.student_name = updateStudentDto.student_name;
    }

    const updatedStudent = await this.studentRepository.save(existingStudent);
    return StudentTransformer.transform(updatedStudent);
  }

  async remove(id: string): Promise<void> {
    const student = await this.studentRepository.findOne({
      where: { student_id: id },
      relations: ['user'],
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // Begin transaction
    await this.studentRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Delete student first
        await transactionalEntityManager.remove(student);

        // Delete associated user if it exists
        if (student.user) {
          await transactionalEntityManager.remove(student.user);
        }
      },
    );
  }
}
