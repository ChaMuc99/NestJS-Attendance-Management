import { Student } from './entities/student.entity';

export class StudentTransformer {
  static transform(student: Student): Partial<Student> {
    return {
      student_id: student.student_id,
      student_name: student.student_name,
      class: student.class
        ? {
            class_id: student.class.class_id,
            class_name: student.class.class_name,
            created_at: student.class.created_at,
            updated_at: student.class.updated_at,
            created_by: student.class.created_by,
            updated_by: student.class.updated_by,
            setCreateTimestamp: student.class.setCreateTimestamp,
            setUpdateTimestamp: student.class.setUpdateTimestamp,
          }
        : null,
      parent: student.parent
        ? {
            parent_id: student.parent.parent_id,
            parent_name: student.parent.parent_name,
            user_id: student.parent.user_id,
            created_at: student.parent.created_at,
            updated_at: student.parent.updated_at,
            created_by: student.parent.created_by,
            updated_by: student.parent.updated_by,
            user: student.parent.user,
            setCreateTimestamp: student.parent.setCreateTimestamp,
            setUpdateTimestamp: student.parent.setUpdateTimestamp,
          }
        : null,
      user: student.user
        ? {
            id: student.user.id,
            user_name: student.user.user_name,
            user_dateofbirth: student.user.user_dateofbirth,
            user_gender: student.user.user_gender,
            user_phone: student.user.user_phone,
            user_email: student.user.user_email,
            user_password: student.user.user_password,
            role: student.user.role,
            teacher: student.user.teacher,
            student: student.user.student,
          }
        : null,
      created_at: student.created_at,
      created_by: student.created_by,
      updated_at: student.updated_at,
      updated_by: student.updated_by,
    };
  }
}
