import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { DeleteResponse } from 'src/response.interfaces';
import { TeacherTransformer } from 'src/shared/transformer/teacher.transformer';
import * as bcrypt from 'bcrypt';


@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private userService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Partial<Teacher>> {
    try {
      const salt = await bcrypt.genSalt();
      createTeacherDto.user.user_password = await bcrypt.hash(
        createTeacherDto.user.user_password,
        salt
      );
  
      // Create new user with hashed password
      const userEntity = this.userRepository.create({
        ...createTeacherDto.user,
        role: 'teacher',
      });
      await this.userRepository.save(userEntity);
  
      // Create teacher entity with all required fields
      const teacherEntity = this.teacherRepository.create({
        teacher_id: createTeacherDto.teacher_id,
        teacher_name: createTeacherDto.teacher_name,
        teacher_department: createTeacherDto.teacher_department, // Make sure this is included
        user: userEntity,
      });
  
      const savedTeacher = await this.teacherRepository.save(teacherEntity);
      return TeacherTransformer.transform(savedTeacher);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed to create teacher',
        error: error.message,
      });
    }
  }  
  
  //-------------------------------------------------------Get all teachers--------------------------------------------------------------//

  async findAll(): Promise<Partial<Teacher>[]> {
    const teachers = await this.teacherRepository.find({
      relations: ['user']
    });
    return teachers.map(teacher => TeacherTransformer.transform(teacher));
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

  ///-------------------------------------------------------Delete a teacher--------------------------------------------------------------//

  async remove(id: string): Promise<DeleteResponse> {
    const teacher = await this.teacherRepository.findOne({
      where: { teacher_id: id },
      relations: ['user'],
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    try {
      await this.teacherRepository.manager.transaction(
        async (transactionalEntityManager) => {
          // Delete teacher first to remove the foreign key reference
          console.log(`Deleting teacher with ID ${id}`);
          await transactionalEntityManager.remove(teacher);

          // Safely delete the user
          if (teacher.user && teacher.user.role === 'teacher') {
            console.log(`Deleting user associated with teacher ${id}`);
            await transactionalEntityManager.remove(teacher.user);
          }
        },
      );

      console.log(`Successfully deleted teacher with ID ${id}`);
      return {
        success: true,
        message: `Teacher with ID ${id} has been successfully deleted`,
      };
    } catch (error) {
      console.error(`Error while deleting teacher ${id}:`, error);
      throw new InternalServerErrorException({
        success: false,
        message: `Failed to delete teacher with ID ${id}`,
        error: error.message,
      });
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
