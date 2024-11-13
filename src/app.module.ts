import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import your feature modules
import { UsersModule } from './modules/users/users.module';
import { ParentModule } from './modules/parent/parent.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { ClassModule } from './modules/class/class.module';
import { StudentModule } from './modules/student/student.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserSeeder } from './database/seeders/database.seeder.service';
import { AttendanceModule } from './modules/markattendance/attendance.module';
import { AnalyticsService } from './modules/analytics/analytics.service';
import { AnalyticsModule } from './modules/analytics/analytics.module';

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
    AttendanceModule,
    AnalyticsModule,
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
