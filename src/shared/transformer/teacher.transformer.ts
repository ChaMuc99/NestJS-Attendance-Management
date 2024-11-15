import { Teacher } from "src/modules/teacher/entities/teacher.entity";

export class TeacherTransformer {
    static transform(teacher: Teacher): Partial<Teacher> {
      if (!teacher) return null;
  
      const transformedTeacher = {
        ...teacher,
        user: teacher.user ? {
          ...teacher.user,
          user_password: undefined
        } : null
      };
  
      return transformedTeacher;
    }
  }
  