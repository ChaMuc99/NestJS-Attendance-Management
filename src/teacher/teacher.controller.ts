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
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

//
@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  //-----------------------------------------------------------------Create Teacher-----------------------------------------------------//
  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    return this.teacherService.create(createTeacherDto);
  }

  //-----------------------------------------------------------------Get All Teachers-----------------------------------------------------//

  @Get()
  @Roles('admin')
  findAll(): Promise<Teacher[]> {
    return this.teacherService.findAll();
  }

  //-----------------------------------------------------------------Get Teacher By ID-----------------------------------------------------//

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string): Promise<Teacher> {
    return this.teacherService.findOne(id);
  }

  //-----------------------------------------------------------------Update Teacher-----------------------------------------------------//

  @Put(':id')
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    return this.teacherService.update(id, updateTeacherDto);
  }

  //-----------------------------------------------------------------Delete Teacher-----------------------------------------------------//

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.teacherService.remove(id);
  }
}
