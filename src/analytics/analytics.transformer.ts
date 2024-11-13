import { Parent } from '../parent/entities/parent.entity';
import { Attendance } from '../markattendance/entities/attendance.entities';

export interface ParentChildrenAttendanceReport {
  parent: {
    parent_id: string;
    parent_name: string;
    user: {
      user_name: string;
      user_dateofbirth: Date;
      user_gender: string;
      user_phone: string;
      user_email: string;
      role: string;
    };
  };
  children: {
    student_id: string;
    student_name: string;
    class: {
      class_id: string;
      class_name: string;
    };
    attendance_records: {
      date: Date;
      status: string;
    }[];
  }[];
}

export class AnalyticsTransformer {
  static transformParentAttendanceReport(
    parent: Parent,
    childrenAttendance: Map<string, Attendance[]>,
  ): ParentChildrenAttendanceReport {
    return {
      parent: {
        parent_id: parent.parent_id,
        parent_name: parent.parent_name,
        user: {
          user_name: parent.user.user_name,
          user_dateofbirth: parent.user.user_dateofbirth,
          user_gender: parent.user.user_gender,
          user_phone: parent.user.user_phone,
          user_email: parent.user.user_email,
          role: parent.user.role,
        },
      },
      children: parent.students.map((student) => ({
        student_id: student.student_id,
        student_name: student.student_name,
        class: {
          class_id: student.class.class_id,
          class_name: student.class.class_name,
        },
        attendance_records: (
          childrenAttendance.get(student.student_id) || []
        ).map((record) => ({
          date: record.attendance_date,
          status: record.attendance_status,
        })),
      })),
    };
  }
}
