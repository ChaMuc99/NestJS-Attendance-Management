/// src/parent/parent.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from './entities/parent.entity';
import { UpdateParentDto } from './dto/update-parent.dto';
import { User } from '../users/entities/user.entity';
import { CreateParentDto } from './dto/create-parent.dto';
import { ParentTransformer } from '../../shared/transformer/parent.transformer';
import { Student } from 'src/modules/student/entities/student.entity';
import { ClassTransformer } from 'class-transformer';
import { getStudentClassTransformer } from 'src/shared/transformer/class.getStudentClassTransformer';
import { DeleteResponse } from 'src/response.interfaces';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ParentService {
  constructor(
    @InjectRepository(Parent)
    private readonly parentRepository: Repository<Parent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //-----------------------------------------------------------------Create Parent-----------------------------------------------------//

  async create(createParentDto: CreateParentDto): Promise<Partial<Parent>> {
    try {
      // Check if parent ID already exists
      const existingParent = await this.parentRepository.findOne({
        where: { parent_id: createParentDto.parent.parent_id },
      });

      if (existingParent) {
        throw new ConflictException(
          `Parent with ID ${createParentDto.parent.parent_id} already exists`,
        );
      }

      // Check if user email already exists
      const existingUser = await this.userRepository.findOne({
        where: { user_email: createParentDto.user.user_email },
      });

      if (existingUser) {
        throw new ConflictException(
          `User with email ${createParentDto.user.user_email} already exists`,
        );
      }

      // Hash the password
      const salt = await bcrypt.genSalt();
      createParentDto.user.user_password = await bcrypt.hash(
        createParentDto.user.user_password,
        salt
      );

      // Create new user
      const userEntity = this.userRepository.create({
        ...createParentDto.user,
        role: 'parent',
      });
      await this.userRepository.save(userEntity);

      // Create parent with user
      const parentEntity = this.parentRepository.create({
        parent_id: createParentDto.parent.parent_id,
        parent_name: createParentDto.parent.parent_name,
        user: userEntity,
      });

      const savedParent = await this.parentRepository.save(parentEntity);
      return ParentTransformer.transform(savedParent);

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Failed to create parent',
        error: error.message,
      });
    }
  }  //-----------------------------------------------------------------Get All Parents-----------------------------------------------------//

  async findAll(): Promise<Partial<Parent>[]> {
    const parents = await this.parentRepository.find({
      relations: ['user'],
      order: {
        parent_id: 'ASC',
        created_at: 'DESC',
      },
    });
    return parents.map((parent) => ParentTransformer.transform(parent));
  }

  //-----------------------------------------------------------------Get Parent by ID-----------------------------------------------------//

  async findOne(id: string): Promise<Partial<Parent>> {
    const parent = await this.parentRepository.findOne({
      where: { parent_id: id },
      relations: ['user'],
    });
    if (!parent) {
      throw new NotFoundException(`Parent with ID ${id} not found.`);
    }
    return ParentTransformer.transform(parent);
  }

  //-----------------------------------------------------------------Update Parent-----------------------------------------------------//

  async update(
    id: string,
    updateParentDto: UpdateParentDto,
  ): Promise<Partial<Parent>> {
    const { parent, user } = updateParentDto;

    const existingParent = await this.findOne(id);

    // Update the Parent details if provided
    if (parent) {
      if (parent.parent_name) existingParent.parent_name = parent.parent_name;
      // Any other parent-specific updates can go here
      await this.parentRepository.save(existingParent);
    }

    // Update the User details if provided
    if (user && existingParent.user) {
      const userToUpdate = await this.userRepository.findOne({
        where: { id: existingParent.user.id },
      });
      if (user.user_name) userToUpdate.user_name = user.user_name;
      if (user.user_dateofbirth)
        userToUpdate.user_dateofbirth = user.user_dateofbirth;
      if (user.user_gender) userToUpdate.user_gender = user.user_gender;
      if (user.user_phone) userToUpdate.user_phone = user.user_phone;
      if (user.user_email) userToUpdate.user_email = user.user_email;
      if (user.user_password) userToUpdate.user_password = user.user_password;
      if (user.role) userToUpdate.role = user.role;

      await this.userRepository.save(userToUpdate);
    }

    return this.findOne(id); // Return updated record with relationships
  }

  //-----------------------------------------------------------------Delete Parent-----------------------------------------------------//

  async remove(id: string): Promise<DeleteResponse> {
    const parent = await this.parentRepository.findOne({
      where: { parent_id: id },
      relations: ['user'],
    });

    if (!parent) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }

    try {
      await this.parentRepository.manager.transaction(
        async (transactionalEntityManager) => {
          // Delete parent first to remove the foreign key reference
          console.log(`Deleting parent with ID ${id}`);
          await transactionalEntityManager.remove(parent);

          // Safely delete the user
          if (parent.user && parent.user.role === 'parent') {
            console.log(`Deleting user associated with parent ${id}`);
            await transactionalEntityManager.remove(parent.user);
          }
        },
      );

      console.log(`Successfully deleted parent with ID ${id}`);
      return {
        success: true,
        message: `Parent with ID ${id} has been successfully deleted`,
      };
    } catch (error) {
      console.error(`Error while deleting parent ${id}:`, error);
      throw new InternalServerErrorException({
        success: false,
        message: `Failed to delete parent with ID ${id}`,
        error: error.message,
      });
    }
  }

  //-----------------------------------------------------------------Get Student by Parent ID-----------------------------------------------------//

  async getStudentsByParentId(
    parentId: string,
  ): Promise<{ total: number; students: Partial<Student>[] }> {
    const parent = await this.parentRepository.findOne({
      where: { parent_id: parentId },
      relations: ['students', 'user'],
    });
    if (!parent) {
      throw new NotFoundException(`Parent with ID ${parentId} not found`);
    }
    const allStudentClass = parent.students.map((student) =>
      getStudentClassTransformer.transform(student),
    );

    return {
      total: allStudentClass.length,
      students: allStudentClass,
    };
  }
}
