import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const { user } = context.switchToHttp().getRequest();

    console.log('Required Roles:', requiredRoles);
    console.log('User Object:', user);
    console.log('User Role:', user?.role);

    if (!user || !requiredRoles.includes(user.role)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return true;
  }
}