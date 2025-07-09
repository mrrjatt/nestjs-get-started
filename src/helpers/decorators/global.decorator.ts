import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../moduels/users/models/user.model';

export const GetUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
