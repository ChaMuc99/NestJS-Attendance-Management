import { Student } from 'src/student/entities/student.entity';

export class getStudentClassTransformer {
  static transform(student: Student): Partial<Student> {
    return {
      student_id: student.student_id,
      student_name: student.student_name,
      user_id: student.user_id,
      created_at: student.created_at,
      updated_at: student.updated_at,
      created_by: student.created_by,
      updated_by: student.updated_by,
    };
  }
}
