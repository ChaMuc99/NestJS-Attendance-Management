// src/parent/parent.controller.ts
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
import { ParentService } from './parent.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { Parent } from './entities/parent.entity';

@Controller('parents')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createParentDto: CreateParentDto): Promise<Parent> {
    return this.parentService.create(createParentDto);
  }

  @Get()
  findAll(): Promise<Parent[]> {
    return this.parentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Parent> {
    return this.parentService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateParentDto: UpdateParentDto,
  ): Promise<Parent> {
    return this.parentService.update(id, updateParentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.parentService.remove(id);
  }
}
