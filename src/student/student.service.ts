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



@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Class) private classRepository: Repository<Class>,
    @InjectRepository(Parent) private parentRepository: Repository<Parent>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private async findOrCreateClass(classData): Promise<Class> {
    console.log('Finding or creating class with data:', classData);
    let classEntity = await this.classRepository.findOneBy({ class_id: classData.class_id });
    if (!classEntity) {
      classEntity = this.classRepository.create({
        class_id: classData.class_id,
        class_name: classData.class_name,
      });
      await this.classRepository.save(classEntity);
      console.log('New class created:', classEntity);
    } else {
      console.log('Existing class found:', classEntity);
    }
    return classEntity;
  }

  private async findOrCreateParent(parentData): Promise<Parent> {
    console.log('Finding or creating parent with data:', parentData);
    let parentEntity = await this.parentRepository.findOneBy({ parent_id: parentData.parent_id });
    if (!parentEntity) {
      // Ensure that parent email is available for user creation
      const userEntity = await this.findOrCreateUser({
        user_name: parentData.parent_name,
        user_email: parentData.user_email, // Ensure you have a user_email for the parent
        user_dateofbirth: parentData.user_dateofbirth, // Optional, adjust as needed
        user_gender: parentData.user_gender, // Optional, adjust as needed
        user_phone: parentData.user_phone, // Optional, adjust as needed
        user_password: parentData.user_password, // Optional, adjust as needed
      });

      parentEntity = this.parentRepository.create({
        parent_id: parentData.parent_id,
        parent_name: parentData.parent_name,
        user_id: userEntity.id, // Link the parent to the user
      });
      await this.parentRepository.save(parentEntity);
      console.log('New parent created:', parentEntity);
    } else {
      console.log('Existing parent found:', parentEntity);
    }
    return parentEntity;
  }

  private async findOrCreateUser(userData): Promise<User> {
    console.log('Finding or creating user with data:', userData);
    let userEntity = await this.userRepository.findOne({ where: { user_email: userData.user_email } });

    if (!userEntity) {
      userEntity = this.userRepository.create({
        user_name: userData.user_name,
        user_dateofbirth: userData.user_dateofbirth,
        user_gender: userData.user_gender,
        user_phone: userData.user_phone,
        user_email: userData.user_email,
        user_password: userData.user_password, 
        role: 'student', // Adjust as necessary for parent or student
      });
      
      await this.userRepository.save(userEntity);
      console.log('New user created:', userEntity);
    } else {
      console.log('Existing user found:', userEntity);
    }

    return userEntity;
  }

  async createStudent(studentData): Promise<Student> {
    console.log('Creating student with data:', studentData);

    // Find or create the class
    const classEntity = await this.findOrCreateClass(studentData.class);

    // Find or create the parent
    const parentEntity = await this.findOrCreateParent(studentData.parent);

    // Find or create the user
    const userEntity = await this.findOrCreateUser(studentData.user);

    // Now create the student with the user linked
    const studentEntity = this.studentRepository.create({
      student_id: studentData.student_id,
      student_name: studentData.student_name,
      class: classEntity,
      parent: parentEntity,
      user: userEntity, // Ensure user is correctly linked
    });

    await this.studentRepository.save(studentEntity);
    console.log('New student created:', studentEntity);
    
    return studentEntity;
  }



  

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { student_id: id },
    });
    if (!student) {
      throw new NotFoundException(`Student with Id ${id} not found`);
    }
    return student;
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    await this.studentRepository.update(id, updateStudentDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const deleteResult = await this.studentRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }
}
