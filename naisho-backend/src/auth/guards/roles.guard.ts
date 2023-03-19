import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'role',
      ctx.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = ctx.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role.includes(role));
  }
}
