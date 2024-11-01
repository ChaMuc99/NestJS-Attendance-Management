import {
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({ length: 80, nullable: true })
  created_by: string;

  @Column({ length: 80, nullable: true })
  updated_by: string;

  @BeforeInsert()
  setCreateTimestamp() {
    this.created_at = new Date();
  }

  @BeforeUpdate()
  setUpdateTimestamp() {
    this.updated_at = new Date();
  }
}
