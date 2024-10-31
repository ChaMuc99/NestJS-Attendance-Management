// src/parent/parent.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from './entities/parent.entity';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';

@Injectable()
export class ParentService {
  constructor(
    @InjectRepository(Parent)
    private readonly parentRepository: Repository<Parent>,
  ) {}

  async create(createParentDto: CreateParentDto): Promise<Parent> {
    const parent = this.parentRepository.create(createParentDto);
    return this.parentRepository.save(parent);
  }


  async findAll(): Promise<Parent[]> {
    return this.parentRepository.find();
  }

  async findOne(id: string): Promise<Parent> {
    const parent = await this.parentRepository.findOne({ where: { parent_id: id } });
    if (!parent) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }
    return parent;
  }

  async update(id: string, updateParentDto: UpdateParentDto): Promise<Parent> {
    await this.parentRepository.update(id, updateParentDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const deleteResult = await this.parentRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }
  }
}
