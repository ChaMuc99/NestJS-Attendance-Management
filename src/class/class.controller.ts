// src/class/class.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './entities/class.entity';
import { DeleteResponse } from 'src/response.interfaces';
import { Student } from 'src/student/entities/student.entity';

@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClassDto: CreateClassDto): Promise<{ message: string; class: Partial<Class> }> {
    return this.classService.create(createClassDto);
  }

  @Get()
  findAll(): Promise<Partial<Class>[]> {
    return this.classService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Partial<Class>> {
    return this.classService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<Partial<Class>> {
    return this.classService.update(id, updateClassDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string): Promise<DeleteResponse> {
    return this.classService.remove(id);
  }

  //Get All Students in a Class
  @Get(':id/students')
  async getStudentsInClass(@Param('id') id: string): Promise<{ total: number; allstudents: Partial<Student>[]; }> {
    return this.classService.getStudentsInClass(id);
  }  
  
}
