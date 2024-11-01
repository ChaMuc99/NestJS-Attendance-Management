// src/teacher/entities/teacher.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Teacher {

  @PrimaryColumn()
  teacher_id: string;

  @Column()
  teacher_name: string;

  @Column()
  teacher_department: string;

  @OneToOne(() => User, (user) => user.teacher, { eager: true })
  @JoinColumn() 
  user: User;
}
