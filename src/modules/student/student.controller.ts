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
  NotFoundException,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { DeleteResponse } from 'src/response.interfaces';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/middlewares/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/middlewares/guards/jwt-auth.guard';
import { request } from 'http';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentController {
  private readonly logger = new Logger(StudentController.name);
  constructor(private readonly studentService: StudentService) {}

  //-----------------------------------------------------------------Create Student-----------------------------------------------------//
  @Post()
  @Roles('admin', 'teacher')
  @HttpCode(201)
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @Req() req: any
  ): Promise<Partial<Student>> {
    console.log(this, req.user);
    return this.studentService.createStudent(createStudentDto);
  }  //-----------------------------------------------------------------Get All Students-----------------------------------------------------//

  @Get()
  @Roles('admin', 'teacher')
  async findAll(): Promise<{ total: number; students: Partial<Student>[] }> {
    return this.studentService.findAll();
  }

  //-----------------------------------------------------------------Get Student By ID-----------------------------------------------------//
  @Get(':id')
  @Roles('admin', 'teacher')
  async findOne(@Param('id') id: string): Promise<Partial<Student>> {
    return this.studentService.findOne(id);
  }

  //-----------------------------------------------------------------Update Student-----------------------------------------------------//

  @Put(':id')
  @Roles('admin', 'teacher')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<Partial<Student>> {
    return this.studentService.update(id, updateStudentDto);
  }

  //-----------------------------------------------------------------Delete Student-----------------------------------------------------//

  @Delete(':id')
  @Roles('admin', 'teacher')
  @HttpCode(HttpStatus.OK) // Changed from NO_CONTENT to OK since we're sending data
  async remove(@Param('id') id: string): Promise<DeleteResponse> {
    return this.studentService.remove(id);
  }
}
