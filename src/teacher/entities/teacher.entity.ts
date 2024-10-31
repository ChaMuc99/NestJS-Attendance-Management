import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('teacher')
export class Teacher extends BaseEntity {
  @Column({ type: 'varchar', length: 45 }) // Define teacher_id as varchar
  teacher_id: string;

  @Column({ length: 80 }) // Assuming teacher_name is a string with a max length of 80
  teacher_name: string;

  @Column({ type: 'int' }) // Assuming user_id is a number (ID)
  user_id: number; // Change to number if it's an integer

  @Column({ length: 80 })
  teacher_department: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' }) // This should still point to the User entity
  user: User;
}
