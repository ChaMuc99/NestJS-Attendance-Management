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
} from '@nestjs/common';
import { Response } from 'express'; // Importing Response from express
import { ParentService } from './parent.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { Parent } from './entities/parent.entity';

@Controller('parents')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createParentDto: CreateParentDto,
    @Res() res: Response, // Injecting Express response
  ): Promise<Response<Parent>> {
    const parent = await this.parentService.create(createParentDto);
    return res.status(HttpStatus.CREATED).json(parent); // Sending structured response
  }

  @Get()
  async findAll(@Res() res: Response): Promise<Response<Parent[]>> {
    const parents = await this.parentService.findAll();
    return res.status(HttpStatus.OK).json(parents); // Sending structured response
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response): Promise<Response<Parent>> {
    const parent = await this.parentService.findOne(id);
    return res.status(HttpStatus.OK).json(parent); // Sending structured response
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateParentDto: UpdateParentDto,
    @Res() res: Response,
  ): Promise<Response<Parent>> {
    const updatedParent = await this.parentService.update(id, updateParentDto);
    return res.status(HttpStatus.OK).json(updatedParent); // Sending structured response
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK) 
  async remove(@Param('id') id: string, @Res() res: Response): Promise<Response<{ message: string }>> {
    await this.parentService.remove(id);
    return res.status(HttpStatus.OK).json({ message: 'Parent deleted successfully!' }); // Sending success message
  }
}

