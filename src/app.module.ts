import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

import { ParentModule} from './parent/parent.module'
import { TeacherModule} from './teacher/teacher.module'
import { ClassModule} from './class/class.module'
import { StudentModule} from './student/student.module'

import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123123',
      database: 'attendancedb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ParentModule,
    TeacherModule,
    ClassModule,
    StudentModule
  ],
})
export class AppModule {}
