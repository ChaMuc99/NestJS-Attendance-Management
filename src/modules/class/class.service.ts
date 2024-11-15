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
import { ClassTransformer } from '../../shared/transformer/class.transformer';
import { DeleteResponse } from 'src/response.interfaces';
import { Student } from 'src/modules/student/entities/student.entity';
import { getStudentClassTransformer } from '../../shared/transformer/class.getStudentClassTransformer';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async create(
    createClassDto: CreateClassDto,
  ): Promise<{ message: string; class: Partial<Class> }> {
    const existingClass = await this.classRepository.findOne({
      where: { class_id: createClassDto.class_id },
    });

    if (existingClass) {
      throw new ConflictException(
        `Class with Class ID ${createClassDto.class_id} already exists`,
      );
    }

    const savedEntity = await this.classRepository.save(
      this.classRepository.create(createClassDto),
    );

    return {
      message: 'Class created successfully!',
      class: ClassTransformer.transform(savedEntity),
    };
  }

  async findAll(): Promise<Partial<Class>[]> {
    const classes = await this.classRepository.find({
      order: {
        class_id: 'ASC',
        created_at: 'DESC',
      },
    });

    return classes.map(ClassTransformer.transform);
  }

  async findOne(id: string): Promise<Partial<Class>> {
    ``;
    const classEntity = await this.classRepository.findOne({
      where: { class_id: id },
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    return ClassTransformer.transform(classEntity);
  }

  async update(
    id: string,
    updateClassDto: UpdateClassDto,
  ): Promise<Partial<Class>> {
    const { affected } = await this.classRepository.update(id, updateClassDto);

    if (!affected) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<DeleteResponse> {
    const classEntity = await this.classRepository.findOne({
      where: { class_id: id },
      relations: ['students'],
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    const studentCount = classEntity.students?.length || 0;
    if (studentCount > 0) {
      throw new ConflictException(
        `Cannot delete class with ID ${id} because it has ${studentCount} associated students`,
      );
    }

    await this.classRepository.delete(id);

    return {
      success: true,
      message: `Class with ID ${id} has been successfully deleted`,
    };
  }

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

    if (!classEntity.students?.length) {
      throw new NotFoundException(
        `No students found in class with ID ${classId}`,
      );
    }

    const orderedStudents = classEntity.students
      .sort((a, b) => a.student_id.localeCompare(b.student_id))
      .map(getStudentClassTransformer.transform);

    return {
      total: orderedStudents.length,
      allstudents: orderedStudents,
    };
  }
}
