import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  NotFoundException, UseGuards
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { DeleteResponse } from 'src/response.interfaces';
import { Roles } from './../auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @Roles('admin', 'teacher')
  @HttpCode(201)
  async create(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<Partial<Student>> {
    return this.studentService.createStudent(createStudentDto);
  }

  @Get()

  @Roles('admin', 'teacher')

  async findAll(): Promise<{ total: number; students: Partial<Student>[] }> {
    return this.studentService.findAll();
  }


  @Get(':id')
  @Roles('admin', 'teacher')
  async findOne(@Param('id') id: string): Promise<Partial<Student>> {
    return this.studentService.findOne(id);
  }

  @Put(':id')
  @Roles('admin', 'teacher')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<Partial<Student>> {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles('admin', 'teacher')
  @HttpCode(HttpStatus.OK) // Changed from NO_CONTENT to OK since we're sending data
  async remove(@Param('id') id: string): Promise<DeleteResponse> {
    return this.studentService.remove(id);
  }
}
