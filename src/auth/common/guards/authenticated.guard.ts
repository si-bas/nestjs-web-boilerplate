import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return (
      request.isAuthenticated() &&
      request.user.prefix === process.env.APP_PREFIX
    );
  }
}
