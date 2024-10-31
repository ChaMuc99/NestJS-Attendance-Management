import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import your feature modules
import { UsersModule } from './users/users.module';
import { ParentModule } from './parent/parent.module';
import { TeacherModule } from './teacher/teacher.module';
import { ClassModule } from './class/class.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Database type
      host: 'localhost', // Database host
      port: 5432, // Database port (default for PostgreSQL)
      username: 'postgres', // Your PostgreSQL username
      password: '123123', // Your PostgreSQL password
      database: 'attendancedb', // Your PostgreSQL database name
      autoLoadEntities: true, // Automatically load entities from your modules
      synchronize: true, // Automatically synchronize your entities with the database
    }),
    UsersModule,
    ParentModule,
    TeacherModule,
    ClassModule,
    StudentModule,
  ],
  controllers: [AppController], // Your app's main controller
  providers: [AppService], // Your app's main service
})
export class AppModule {}
