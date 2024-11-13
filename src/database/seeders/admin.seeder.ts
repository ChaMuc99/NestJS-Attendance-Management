import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entities/user.entity';

@Injectable()
export class AdminSeeder {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seed() {
    const adminEmail = 'admin@example.com';

    const existingAdmin = await this.userRepository.findOne({
      where: { user_email: adminEmail },
    });

    if (!existingAdmin) {
      const adminUser = this.userRepository.create({
        user_email: adminEmail,
        user_password: 'AdminPassword123!',
        role: 'admin',
        user_name: 'Admin',
      });

      await this.userRepository.save(adminUser);
      console.log('Default admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  }
}
