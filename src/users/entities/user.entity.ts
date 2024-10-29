// src/users/entities/user.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';

@Entity('user')
export class User extends BaseEntity {
  @Column({ length: 80 })
  user_name: string;

  @Column({ type: 'date' })
  user_dateofbirth: Date;

  @Column({ length: 20 })
  user_gender: string;

  @Column({ length: 80 })
  user_phone: string;

  @Column({ length: 100, unique: true })
  user_email: string;

  @Column({ length: 255 })
  user_password: string;

  @Column({ length: 50 })
  role: string; 
}
