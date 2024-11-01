// src/class/class.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const classEntity = this.classRepository.create(createClassDto);
    return this.classRepository.save(classEntity);
  }

  async findAll(): Promise<Class[]> {
    return this.classRepository.find();
  }

  async findOne(id: string): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { class_id: id },
    });
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    return classEntity;
  }

  async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    await this.classRepository.update(id, updateClassDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const deleteResult = await this.classRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
  }
}
