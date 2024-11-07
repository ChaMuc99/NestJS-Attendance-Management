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
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express'; // Importing Response from express
import { ParentService } from './parent.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { Parent } from './entities/parent.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('parents')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  //-----------------------------------------------------------------Create Parent-----------------------------------------------------//

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createParentDto: CreateParentDto,
    @Res() res: Response, // Injecting Express response
  ): Promise<Response<Parent>> {
    const parent = await this.parentService.create(createParentDto);
    return res.status(HttpStatus.CREATED).json(parent); // Sending structured response
  }

  //-----------------------------------------------------------------Get All Parents-----------------------------------------------------//

  @Get()
  @Roles('admin')
  async findAll(@Res() res: Response): Promise<Response> {
    const parents = await this.parentService.findAll();
    return res.status(HttpStatus.OK).json(parents);
  }

  //-----------------------------------------------------------------Get Parent By ID-----------------------------------------------------//

  @Get(':id')
  @Roles('admin')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const parent = await this.parentService.findOne(id);
    return res.status(HttpStatus.OK).json(parent);
  }

  //-----------------------------------------------------------------Update Parent-----------------------------------------------------//

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateParentDto: UpdateParentDto,
    @Res() res: Response,
  ): Promise<Response<Parent>> {
    const updatedParent = await this.parentService.update(id, updateParentDto);
    return res.status(HttpStatus.OK).json(updatedParent); // Sending structured response
  }

  //-----------------------------------------------------------------Delete Parent-----------------------------------------------------//

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response<{ message: string }>> {
    await this.parentService.remove(id);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Parent deleted successfully!' }); // Sending success message
  }

  //---------------------------------------------------------------Get Students in Parent-----------------------------------------------------//
  @Get(':id/students')
  async ParentStudents(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const students = await this.parentService.getStudentsByParentId(id);
    return res.status(HttpStatus.OK).json(students);
  }
}
