import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../base/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Student } from 'src/modules/student/entities/student.entity';

@Entity('parent')
export class Parent extends BaseEntity {
  @PrimaryColumn({ length: 45 })
  parent_id: string;

  @Column({ length: 80 })
  parent_name: string;

  @Column()
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Student, (student) => student.parent)
  students: Student[];
}
