import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seed() {
    const adminEmail = 'admin@example.com';

    // Check if admin already exists
    const existingAdmin = await this.userRepository.findOne({
      where: { user_email: adminEmail },
    });

    if (!existingAdmin) {
      const adminUser = this.userRepository.create({
        user_name: 'Admin',
        user_email: adminEmail,
        user_password: 'AdminPassword123!',
        user_dateofbirth: new Date('1990-01-01'),
        user_gender: 'other',
        role: 'admin',
        user_phone: '0000000000',
      });

      await this.userRepository.save(adminUser);
      console.log('Admin user created successfully');
    }
  }
}
