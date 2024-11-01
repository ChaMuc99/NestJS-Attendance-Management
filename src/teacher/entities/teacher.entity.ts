// src/teacher/entities/teacher.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  teacher_id: string;

  @Column()
  teacher_name: string;

  @Column()
  teacher_department: string;

  @OneToOne(() => User, user => user.teacher, { eager: true })
  @JoinColumn() // This will create the foreign key relationship
  user: User;
}
