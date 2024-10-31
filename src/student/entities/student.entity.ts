import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { Class } from '../../class/entities/class.entity';
import { Parent } from '../../parent/entities/parent.entity';

@Entity('student')
export class Student extends BaseEntity {
  @Column() 
  student_id: string;

  @Column() 
  student_name: string;

  @Column() 
  user_id: string;

  @Column() 
  class_id: string;

  @Column() 
  parent_id: string;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => Parent)
  @JoinColumn({ name: 'parent_id' })
  parent: Parent;
}
