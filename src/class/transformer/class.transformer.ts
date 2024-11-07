import { ClassResponseDto } from '../dto/class-response.dto';
import { Class } from '../entities/class.entity';

export class ClassTransformer {
  static transform(classEntity: Class): ClassResponseDto {
    if (!classEntity) {
      return null;
    }

    return {
      class_id: classEntity.class_id,
      class_name: classEntity.class_name,
      created_at: classEntity.created_at,
      updated_at: classEntity.updated_at,
      created_by: classEntity.created_by,
      updated_by: classEntity.updated_by,
    };
  }
}
