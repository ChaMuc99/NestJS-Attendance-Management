import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';

@Entity('class')
export class Class extends BaseEntity {
  @Column() // Default to the appropriate type in your database (e.g., varchar)
  class_id: string;

  @Column({ length: 80 }) // Assuming class_name is a string with a max length of 80
  class_name: string;

  @Column({ type: 'varchar' }) // Define teacher_id as varchar without length, or specify length if necessary
  teacher_id: string;

  @ManyToOne(() => Teacher, { nullable: false }) // Ensure it's not nullable if a class must have a teacher
  @JoinColumn({ name: 'teacher_id' }) // Specify the foreign key column
  teacher: Teacher; // This establishes the relationship to the Teacher entity
}
