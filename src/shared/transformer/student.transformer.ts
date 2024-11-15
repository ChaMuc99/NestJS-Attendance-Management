import { Student } from "src/modules/student/entities/student.entity";

export class StudentTransformer {
  static transform(student: Student): Partial<Student> {
    if (!student) return null;

    const transformedStudent = {
      ...student,
      class: student.class,
      parent: student.parent,
      user: student.user ? {
        ...student.user,
        user_password: undefined
      } : null
    };

    return transformedStudent;
  }
}
