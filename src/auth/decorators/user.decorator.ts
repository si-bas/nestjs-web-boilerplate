import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as _ from 'lodash';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request.session.passport;
    return { ...user, rolesString: _(user.roles).map('name').value() };
  },
);
