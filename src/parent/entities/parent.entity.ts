import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('parent')
export class Parent extends BaseEntity {
  @Column({ length: 45 })
  parent_id: string;

  @Column({ length: 80 })
  parent_name: string;

  @Column()
  user_id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
