import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const IsAdmin = createParamDecorator(
    (data: unknown, context: ExecutionContext): boolean => {
        const request = context.switchToHttp().getRequest();
        return request.user.role == 'admin';
    },
);
