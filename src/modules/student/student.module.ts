import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from './entities/student.entity';
import { Class } from '../class/entities/class.entity';
import { Parent } from '../parent/entities/parent.entity';
import { User } from '../users/entities/user.entity';
import { ClassModule } from '../class/class.module'; // Import ClassModule
import { ParentModule } from '../parent/parent.module'; // Import ParentModule
import { UsersModule } from '../users/users.module'; // Import UserModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Class, Parent, User]), // Registering repositories
    ClassModule,
    ParentModule,
    UsersModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
