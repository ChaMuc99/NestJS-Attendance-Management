export class CreateStudentDto {
  student_id: string;
  student_name: string;
  class: {
    class_id: string;
    class_name: string;  
    teacher_id?: string;  

  };
  parent: {
    parent_id: string;
    parent_name: string;  
  
  };
  user: {
    user_id: string;          
    user_name: string;  
    user_dateofbirth?: Date; 
    user_gender?: string;    
  
  };
}
