import { Parent } from '../../modules/parent/entities/parent.entity';

export class ParentTransformer {
  static transform(parent: Parent): Partial<Parent> {
    return {
      parent_id: parent.parent_id,
      parent_name: parent.parent_name,
      user_id: parent.user_id,
      user: parent.user
        ? {
            id: parent.user.id,
            user_name: parent.user.user_name,
            user_dateofbirth: parent.user.user_dateofbirth,
            user_gender: parent.user.user_gender,
            user_phone: parent.user.user_phone,
            user_email: parent.user.user_email,
            user_password: parent.user.user_password,
            role: parent.user.role,
            teacher: parent.user.teacher,
            student: parent.user.student,
          }
        : null,
      created_at: parent.created_at,
      created_by: parent.created_by,
      updated_by: parent.updated_by,
      updated_at: parent.updated_at,
    };
  }
}
