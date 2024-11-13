import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { BaseEntity } from '../../../entities/base.entity';

@Entity('class')
export class Class extends BaseEntity {
  @PrimaryColumn()
  class_id: string;

  @Column({ length: 80 })
  class_name: string;

  @OneToMany(() => Student, (student) => student.class)
  students: Student[];
}
