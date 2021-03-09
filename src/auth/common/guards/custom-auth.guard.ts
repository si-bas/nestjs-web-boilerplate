import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const { id } = context.switchToHttp().getRequest().query;

    const result: boolean = id ? true : false;
    const request = context.switchToHttp().getRequest();
    request.body = {
      username: id,
      password: id,
    };

    await super.logIn(request);
    return result;
  }
}
