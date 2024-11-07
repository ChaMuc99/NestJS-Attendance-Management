import { Module, OnModuleInit } from '@nestjs/common';

import { AdminSeeder } from './seeders/admin.seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AdminSeeder],
  exports: [AdminSeeder],
})
export class AppModule implements OnModuleInit {
  constructor(private adminSeeder: AdminSeeder) {}

  async onModuleInit() {
    await this.adminSeeder.seed();
  }
}
