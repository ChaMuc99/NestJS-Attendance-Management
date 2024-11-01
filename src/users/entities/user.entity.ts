// src/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Teacher } from '../../teacher/entities/teacher.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  user_name: string;

  @Column()
  user_dateofbirth: Date;

  @Column()
  user_gender: string;

  @Column()
  user_phone: string;

  @Column()
  user_email: string;

  @Column()
  user_password: string;

  @Column() 
  role: string; 

  @OneToOne(() => Teacher, teacher => teacher.user)
  teacher: Teacher; 
}
