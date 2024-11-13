import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private userService: UsersService,
  ) {}

  //-------------------------------------------------------Create a new teacher--------------------------------------------------------------//

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    // Check for existing teacher with same teacher_id
    const existingTeacher = await this.teacherRepository.findOne({
      where: { teacher_id: createTeacherDto.teacher_id },
    });

    if (existingTeacher) {
      throw new ConflictException(
        `Teacher with ID ${createTeacherDto.teacher_id} already exists`,
      );
    }

    // Check for existing user with same email
    const existingUser = await this.userService.findByEmail(
      createTeacherDto.user_email,
    );

    if (existingUser) {
      throw new ConflictException(
        `User with email ${createTeacherDto.user_email} already exists`,
      );
    }

    // Proceed with creation if no duplicates found
    const user = await this.userService.create({
      user_email: createTeacherDto.user_email,
      user_password: createTeacherDto.user_password,
      user_name: createTeacherDto.user_name,
      user_dateofbirth: createTeacherDto.user_dateofbirth,
      user_gender: createTeacherDto.user_gender,
      user_phone: createTeacherDto.user_phone,
      role: 'teacher',
    });

    const teacher = this.teacherRepository.create({
      teacher_id: createTeacherDto.teacher_id,
      teacher_name: createTeacherDto.teacher_name,
      teacher_department: createTeacherDto.teacher_department,
      user: user,
    });

    return await this.teacherRepository.save(teacher);
  }

  //-------------------------------------------------------Get all teachers--------------------------------------------------------------//

  async findAll(): Promise<Teacher[]> {
    return this.teacherRepository.find();
  }

  //-------------------------------------------------------Get a teacher by ID--------------------------------------------------------------//

  async findOne(id: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { teacher_id: id },
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  //-------------------------------------------------------Update a teacher--------------------------------------------------------------//

  async update(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    const teacher = await this.findOne(id);

    // Update teacher data
    const teacherUpdate = {
      teacher_name: updateTeacherDto.teacher_name,
      teacher_department: updateTeacherDto.teacher_department,
    };
    await this.teacherRepository.update(id, teacherUpdate);

    // Update associated user data
    if (teacher.user) {
      const userUpdate: Partial<User> = {
        user_name: updateTeacherDto.user_name,
        user_email: updateTeacherDto.user_email,
        user_dateofbirth: updateTeacherDto.user_dateofbirth,
        user_gender: updateTeacherDto.user_gender,
        user_phone: updateTeacherDto.user_phone,
      };
      await this.userService.updateUser(teacher.user.id, userUpdate as User);
    }

    // Return updated teacher with relations
    return await this.teacherRepository.findOne({
      where: { teacher_id: id },
      relations: ['user'],
    });
  }
  async remove(id: string): Promise<void> {
    const deleteResult = await this.teacherRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
  }
  //-------------------------------------------------------Get a teacher by user ID--------------------------------------------------------------//
  async findByUserId(userId: string): Promise<Teacher> {
    return this.teacherRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
