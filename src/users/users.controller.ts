import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto'; 
import { User } from './entities/user.entity';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    console.log('UserController initialized');
  }

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

 
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() userData: any) {
    return this.usersService.updateUser(id, userData);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
