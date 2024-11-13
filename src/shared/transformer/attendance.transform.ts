export interface TransformedAttendance {
  attendance_id: string;
  attendance_date: string;
  attendance_status: string;
  attendance_note: string;

  student: {
    student_id: string;
    student_name: string;
    user_id: string;
  };
  class: {
    class_id: string;
    class_name: string;
  };
  marked_by_teacher: any;
  marked_by_user: {
    id: string;
    user_name: string;
    user_dateofbirth: string;
    user_gender: string;
    user_phone: string;
    user_email: string;
    role: string;
  };
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export const transformAttendance = (attendance: any): TransformedAttendance => {
  return {
    attendance_id: attendance.attendance_id,
    attendance_date: attendance.attendance_date,
    attendance_status: attendance.attendance_status,
    attendance_note: attendance.attendance_note,

    student: {
      student_id: attendance.student.student_id,
      student_name: attendance.student.student_name,
      user_id: attendance.student.user_id,
    },
    class: {
      class_id: attendance.class.class_id,
      class_name: attendance.class.class_name,
    },
    marked_by_teacher: attendance.marked_by_teacher,
    marked_by_user: attendance.marked_by_user
      ? {
          id: attendance.marked_by_user.id,
          user_name: attendance.marked_by_user.user_name,
          user_dateofbirth: attendance.marked_by_user.user_dateofbirth,
          user_gender: attendance.marked_by_user.user_gender,
          user_phone: attendance.marked_by_user.user_phone,
          user_email: attendance.marked_by_user.user_email,
          role: attendance.marked_by_user.role,
        }
      : null,
    created_by: attendance.created_by,
    updated_by: attendance.updated_by,
    created_at: attendance.created_at,
    updated_at: attendance.updated_at,
  };
};
