import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import your feature modules
import { UsersModule } from './users/users.module';
import { ParentModule } from './parent/parent.module';
import { TeacherModule } from './teacher/teacher.module';
import { ClassModule } from './class/class.module';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { UserSeeder } from './database/seeders/database.seeder.service';

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
    UsersModule,
    ParentModule,
    TeacherModule,
    ClassModule,
    StudentModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserSeeder],
})
export class AppModule implements OnModuleInit {
  constructor(private userSeeder: UserSeeder) {}

  async onModuleInit() {
    await this.userSeeder.seed();
  }
}
