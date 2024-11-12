import { 
  Entity, 
  Column, 
  PrimaryColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn,
  PrimaryGeneratedColumn

} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Class } from '../../class/entities/class.entity';
import { User } from '../../users/entities/user.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid') 
  attendance_id: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column({ type: 'date' })
  attendance_date: Date;

  @Column()
  attendance_status: string;

  @Column({ nullable: true })
  attendance_note?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'marked_by_user_id' })
  marked_by_user?: User;

  @ManyToOne(() => Teacher, { nullable: true })
  @JoinColumn({ name: 'marked_by_teacher_id' })
  marked_by_teacher?: Teacher;

  @Column({ nullable: true })
  created_by: string;

  @Column({ nullable: true })
  updated_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}