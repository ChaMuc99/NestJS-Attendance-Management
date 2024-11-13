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
  UseGuards,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './entities/class.entity';
import { DeleteResponse } from 'src/response.interfaces';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Student } from 'src/modules/student/entities/student.entity';

@Controller('class')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  //-----------------------------------------------------------------Create Class-----------------------------------------------------//
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('admin')
  create(
    @Body() createClassDto: CreateClassDto,
  ): Promise<{ message: string; class: Partial<Class> }> {
    return this.classService.create(createClassDto);
  }

  //-----------------------------------------------------------------Get All Classes-----------------------------------------------------//
  @Get()
  @Roles('admin')
  findAll() {
    return this.classService.findAll();
  }

  //-----------------------------------------------------------------Get Class By ID-----------------------------------------------------//
  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string): Promise<Partial<Class>> {
    return this.classService.findOne(id);
  }

  //-----------------------------------------------------------------Update Class-----------------------------------------------------//
  @Put(':id')
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<Partial<Class>> {
    return this.classService.update(id, updateClassDto);
  }

  //-----------------------------------------------------------------Delete Class-----------------------------------------------------//
  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string): Promise<DeleteResponse> {
    return this.classService.remove(id);
  }

  //---------------------------------------------------------------Get Students in Class-----------------------------------------------------//
  @Get(':id/students')
  @Roles('admin')
  async getStudentsInClass(
    @Param('id') id: string,
  ): Promise<{ total: number; allstudents: Partial<Student>[] }> {
    return this.classService.getStudentsInClass(id);
  }
}
