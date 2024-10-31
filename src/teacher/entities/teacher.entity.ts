
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('teacher')
export class Teacher extends BaseEntity {
  @Column({ length: 45 })
  teacher_id: string;

  @Column({ length: 80 })
  teacher_name: string;

  @Column({ length: 45 })
  user_id: string;

  @Column({ length: 80 })
  teacher_department: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
