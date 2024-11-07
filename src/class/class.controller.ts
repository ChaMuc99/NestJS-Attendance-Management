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
  UseGuards
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './entities/class.entity';
import { DeleteResponse } from 'src/response.interfaces';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('class')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @Roles('admin')
  create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.classService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string): Promise<Partial<Class>> {
    return this.classService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<Partial<Class>> {
    return this.classService.update(id, updateClassDto);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string): Promise<DeleteResponse> {
    return this.classService.remove(id);
  }

  //Get All Students in a Class
  @Get(':id/students')
  @Roles('admin')
  async getStudentsInClass(@Param('id') id: string): Promise<any[]> {
    return this.classService.getStudentsInClass(id);
  }
  
  
}
