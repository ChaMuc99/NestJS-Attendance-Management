import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';

@Entity('class')
export class Class extends BaseEntity {
  @PrimaryColumn()
  class_id: string;

  @Column({ length: 80 })
  class_name: string;
}
