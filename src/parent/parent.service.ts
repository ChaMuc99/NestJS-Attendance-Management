/// src/parent/parent.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from './entities/parent.entity';
import { UpdateParentDto } from './dto/update-parent.dto';
import { User } from '.././users/entities/user.entity'
import { CreateParentDto } from './dto/create-parent.dto'

@Injectable()
export class ParentService {
  constructor(
    @InjectRepository(Parent)
    private readonly parentRepository: Repository<Parent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createParentDto: CreateParentDto): Promise<Parent> {
    const { parent, user } = createParentDto;

    // Check if a parent with the same parent_id already exists
    const existingParent = await this.parentRepository.findOne({
      where: { parent_id: parent.parent_id },
    });
    if (existingParent) {
      throw new ConflictException(`Parent with ID ${parent.parent_id} already exists.`);
    }

    // Create user
    const newUser = this.userRepository.create({
      user_name: user.user_name,
      user_dateofbirth: user.user_dateofbirth,
      user_gender: user.user_gender,
      user_phone: user.user_phone,
      user_email: user.user_email,
      user_password: user.user_password,
      role: user.role,
    });
    const savedUser = await this.userRepository.save(newUser);

    // Create parent with linked user
    const newParent = this.parentRepository.create({
      parent_id: parent.parent_id,
      parent_name: parent.parent_name,
      user_id: savedUser.id,
      user: savedUser,
    });
    
    return this.parentRepository.save(newParent);
  }

  async findAll(): Promise<Parent[]> {
    return this.parentRepository.find({ relations: ['user'] }); 
  }

  async findOne(id: string): Promise<Parent> {
    const parent = await this.parentRepository.findOne({
      where: { parent_id: id },
      relations: ['user'],
    });
    if (!parent) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }
    return parent;
  }


  async update(id: string, updateParentDto: UpdateParentDto): Promise<Parent> {
    const { parent, user } = updateParentDto;
  
    // Find the existing parent record
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
      if (user.user_dateofbirth) userToUpdate.user_dateofbirth = user.user_dateofbirth;
      if (user.user_gender) userToUpdate.user_gender = user.user_gender;
      if (user.user_phone) userToUpdate.user_phone = user.user_phone;
      if (user.user_email) userToUpdate.user_email = user.user_email;
      if (user.user_password) userToUpdate.user_password = user.user_password;
      if (user.role) userToUpdate.role = user.role;
  
      await this.userRepository.save(userToUpdate);
    }
  
    return this.findOne(id); // Return updated record with relationships
  }
  

  async remove(id: string): Promise<void> {
    const deleteResult = await this.parentRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }
  }
}
