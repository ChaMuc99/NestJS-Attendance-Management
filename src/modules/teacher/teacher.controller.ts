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
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/middlewares/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/middlewares/guards/jwt-auth.guard';
import { DeleteResponse } from 'src/response.interfaces';

//
@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  //-----------------------------------------------------------------Create Teacher-----------------------------------------------------//
  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTeacherDto: CreateTeacherDto): Promise<Partial<Teacher>> {
    return this.teacherService.create(createTeacherDto);
  }

  //-----------------------------------------------------------------Get All Teachers-----------------------------------------------------//

  @Get()
  @Roles('admin')
  findAll(): Promise<Partial<Teacher>[]> {
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
  remove(@Param('id') id: string): Promise<DeleteResponse> {
    return this.teacherService.remove(id);
  }
}
