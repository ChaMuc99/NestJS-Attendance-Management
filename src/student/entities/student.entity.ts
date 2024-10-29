
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { Class } from '../../class/entities/class.entity';
import { Parent } from '../../parent/entities/parent.entity';

@Entity('student')
export class Student extends BaseEntity {
  @Column({ length: 45 })
  student_id: string;

  @Column({ length: 80 })
  student_name: string;

  @Column({ length: 45 })
  user_id: string;

  @Column({ length: 45 })
  class_id: string;

  @Column({ length: 45 })
  parent_id: string;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => Parent)
  @JoinColumn({ name: 'parent_id' })
  parent: Parent;
}
