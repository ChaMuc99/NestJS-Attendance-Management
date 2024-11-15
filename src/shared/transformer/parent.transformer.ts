import { Parent } from '../../modules/parent/entities/parent.entity';

export class ParentTransformer {
  static transform(parent: Parent): Partial<Parent> {
    if (!parent) return null;

    const transformedParent = {
      ...parent,
      user: parent.user ? {
        ...parent.user,
        user_password: undefined
      } : null
    };

    return transformedParent;
  }
}
