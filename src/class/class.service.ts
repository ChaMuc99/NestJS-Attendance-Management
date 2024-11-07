// src/class/class.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ClassTransformer } from './transformer/class.transformer';
import { DeleteResponse } from 'src/response.interfaces';
import { Student } from 'src/student/entities/student.entity';
import { getStudentClassTransformer } from './transformer/class.getStudentClassTransformer';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  //-----------------------------------------------------------------Create Class-----------------------------------------------------//

  async create(
    createClassDto: CreateClassDto,
  ): Promise<{ message: string; class: Partial<Class> }> {
    // Check if class with the same name already exists
    const existingClass = await this.classRepository.findOne({
      where: { class_name: createClassDto.class_name },
    });
    if (existingClass) {
      throw new ConflictException(
        `Class with name ${createClassDto.class_name} already exists`,
      );
    }
    const classEntity = this.classRepository.create(createClassDto);
    const savedEntity = await this.classRepository.save(classEntity);
    const transformedClass = ClassTransformer.transform(savedEntity);

    return {
      message: 'Class created successfully!',
      class: transformedClass,
    };
  }

  //-----------------------------------------------------------------Get All Classes-----------------------------------------------------//

  async findAll(): Promise<Partial<Class>[]> {
    const classes = await this.classRepository.find({
      order: {
        class_id: 'ASC',
        created_at: 'DESC',
      },
    });
    return classes.map((classEntity) =>
      ClassTransformer.transform(classEntity),
    );
  }

  //-----------------------------------------------------------------Get Class by ID-----------------------------------------------------//

  async findOne(id: string): Promise<Partial<Class>> {
    const classEntity = await this.classRepository.findOne({
      where: { class_id: id },
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    return ClassTransformer.transform(classEntity);
  }

  //-----------------------------------------------------------------Update Class-----------------------------------------------------//

  async update(
    id: string,
    updateClassDto: UpdateClassDto,
  ): Promise<Partial<Class>> {
    const updateResult = await this.classRepository.update(id, updateClassDto);

    if (!updateResult.affected) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    const updatedEntity = await this.findOne(id);
    return updatedEntity;
  }

  ///-----------------------------------------------------------------Delete Class-----------------------------------------------------//

  async remove(id: string): Promise<DeleteResponse> {
    const classEntity = await this.classRepository.findOne({
      where: { class_id: id },
      relations: ['students'],
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    if (classEntity.students && classEntity.students.length > 0) {
      throw new ConflictException(
        `Cannot delete class with ID ${id} because it has ${classEntity.students.length} associated students`,
      );
    }

    const deleteResult = await this.classRepository.delete(id);

    return {
      success: true,
      message: `Class with ID ${id} has been successfully deleted`,
    };
  }

  //-----------------------------------------------------------------Get Students in Class-----------------------------------------------------//
  async getStudentsInClass(
    classId: string,
  ): Promise<{ total: number; allstudents: Partial<Student>[] }> {
    const classEntity = await this.classRepository.findOne({
      where: { class_id: classId },
      relations: ['students'],
      order: {
        created_at: 'DESC',
      },
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }
    if (!classEntity.students || classEntity.students.length === 0) {
      throw new NotFoundException(
        `No students found in class with ID ${classId}`,
      );
    }

    const orderedStudents = classEntity.students
      .sort((a, b) => a.student_id.localeCompare(b.student_id))
      .map((student) => getStudentClassTransformer.transform(student));

    return {
      total: orderedStudents.length,
      allstudents: orderedStudents,
    };
  }
}
