// src/student/student.service.ts
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { User } from '../users/entities/user.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Class } from '../class/entities/class.entity';
import { Parent } from '../parent/entities/parent.entity';
import { StudentTransformer } from './student.transformer';
import { DeleteResponse } from 'src/response.interfaces';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Class) private classRepository: Repository<Class>,
    @InjectRepository(Parent) private parentRepository: Repository<Parent>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}


  //-------------------------------------------------------Create a new student--------------------------------------------------------------//

    async createStudent(studentData: CreateStudentDto): Promise<Partial<Student> & { message: string }> {
      try {
        // Check for existing student ID
        const existingStudent = await this.studentRepository.findOne({
          where: { student_id: studentData.student_id }
        });

        if (existingStudent) {
          throw new ConflictException(
            `Student with ID ${studentData.student_id} already exists`
          );
        }

        // Check if class exists first
        const existingClass = await this.classRepository.findOneBy({
          class_id: studentData.class.class_id,
        });

        if (!existingClass) {
          throw new NotFoundException(
            `Class with ID ${studentData.class.class_id} not found`,
          );
        }

        // Check if parent exists
        const existingParent = await this.parentRepository.findOneBy({
          parent_id: studentData.parent.parent_id,
        });

        if (!existingParent) {
          throw new NotFoundException(
            `Parent with ID ${studentData.parent.parent_id} not found`,
          );
        }

        // Check if user email already exists
        const existingUser = await this.userRepository.findOne({
          where: { user_email: studentData.user.user_email },
        });

        if (existingUser) {
          throw new ConflictException(
            `User with email ${studentData.user.user_email} already exists`,
          );
        }

        // Create new user
        const userEntity = this.userRepository.create({
          ...studentData.user,
          role: 'student',
        });
        await this.userRepository.save(userEntity);

        // Create student with existing class and parent
        const studentEntity = this.studentRepository.create({
          student_id: studentData.student_id,
          student_name: studentData.student_name,
          class: existingClass,
          parent: existingParent,
          user: userEntity,
        });

        const savedStudent = await this.studentRepository.save(studentEntity);

        return {
          ...StudentTransformer.transform(savedStudent),
          message: `Student with ID ${studentData.student_id} has been successfully created`,
        };
      } catch (error) {
        // Handle specific errors
        if (error instanceof NotFoundException || error instanceof ConflictException) {
          throw error;
        }
    
        // Handle other errors
        throw new InternalServerErrorException({
          message: 'Failed to create student',
          error: error.message,
        });
      }
  }


  //-------------------------------------------------------Get all students--------------------------------------------------------------//

  async findAll(): Promise<{ total: number, students: Partial<Student>[]} > {
    const students = await this.studentRepository.find({
      relations: ['class', 'parent', 'user'],
      order: {
        student_id: 'ASC',
        created_at: 'DESC',
      },
    });
    const transformedStudents = students.map((student) => StudentTransformer.transform(student));

    return {
      total: students.length,
      students: transformedStudents,
    }
  }
  
  //-------------------------------------------------------Get a single student--------------------------------------------------------------//

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

  //-------------------------------------------------------Update a student--------------------------------------------------------------//

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Partial<Student> & { message: string }> {
    const existingStudent = await this.studentRepository.findOne({
      where: { student_id: id },
      relations: ['class', 'parent', 'user'],
    });
  
    if (!existingStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  
    try {
      // Update user details if provided
      if (updateStudentDto.user) {
        // Update the existing user instead of creating a new one
        const existingUser = existingStudent.user;
        
        // Update only the user fields that are provided
        if (updateStudentDto.user.user_name) {
          existingUser.user_name = updateStudentDto.user.user_name;
        }
        if (updateStudentDto.user.user_dateofbirth) {
          existingUser.user_dateofbirth = updateStudentDto.user.user_dateofbirth;
        }
        if (updateStudentDto.user.user_gender) {
          existingUser.user_gender = updateStudentDto.user.user_gender;
        }
        if (updateStudentDto.user.user_phone) {
          existingUser.user_phone = updateStudentDto.user.user_phone;
        }
        if (updateStudentDto.user.user_email) {
          existingUser.user_email = updateStudentDto.user.user_email;
        }
  
        // Save the updated user
        await this.userRepository.save(existingUser);
      }
  
      // Update student name if provided
      if (updateStudentDto.student_name) {
        existingStudent.student_name = updateStudentDto.student_name;
      }
  
      const updatedStudent = await this.studentRepository.save(existingStudent);
      return {
        ...StudentTransformer.transform(updatedStudent),
        message: `Student with ID ${id} has been successfully updated`,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: `Failed to update student with ID ${id}`,
        error: error.message,
      });
    }
  }
  
  async remove(id: string): Promise<DeleteResponse> {
    const student = await this.studentRepository.findOne({
      where: { student_id: id },
      relations: ['user'],
    });
  
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  
    try {
      await this.studentRepository.manager.transaction(
        async (transactionalEntityManager) => {
          // Delete student first to remove the foreign key reference
          console.log(`Deleting student with ID ${id}`);
          await transactionalEntityManager.remove(student);

          // Now we can safely delete the user
          if (student.user && student.user.role === 'student') {
            console.log(`Deleting user associated with student ${id}`);
            await transactionalEntityManager.remove(student.user);
          }
        }
      );
  
      console.log(`Successfully deleted student with ID ${id}`);
      return {
        success: true,
        message: `Student with ID ${id} has been successfully deleted`,
      };
    } catch (error) {
      console.error(`Error while deleting student ${id}:`, error);
      throw new InternalServerErrorException({
        success: false,
        message: `Failed to delete student with ID ${id}`,
        error: error.message,
      });
    }
  }


} 
