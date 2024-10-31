
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';

@Entity('class')
export class Class extends BaseEntity {
  @Column({ length: 45 })
  class_id: string;

  @Column({ length: 80 })
  class_name: string;

  @Column({ length: 45 })
  teacher_id: string;

  @ManyToOne(() => Teacher)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;
}
