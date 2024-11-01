import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private userService: UsersService,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
 
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

  async findAll(): Promise<Teacher[]> {
    return this.teacherRepository.find();
  }

  async findOne(id: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({ where: { teacher_id: id } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
    await this.teacherRepository.update(id, updateTeacherDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const deleteResult = await this.teacherRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
  }
}
