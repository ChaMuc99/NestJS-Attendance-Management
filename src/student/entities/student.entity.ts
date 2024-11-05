import { Entity, Column, ManyToOne, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { Class } from '../../class/entities/class.entity';
import { Parent } from '../../parent/entities/parent.entity';
import { User } from '../../users/entities/user.entity';

@Entity('student')
export class Student extends BaseEntity {
  @PrimaryColumn()
  student_id: string;

  @Column()
  student_name: string;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => Parent)
  @JoinColumn({ name: 'parent_id' })
  parent: Parent;

  @Column()
  user_id: string;

  @OneToOne(() => User, (user) => user.student, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
  
}
