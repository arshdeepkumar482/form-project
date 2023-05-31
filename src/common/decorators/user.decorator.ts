import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequest } from '../common.interface';
import { IUser } from '../../user/user';

export const User = createParamDecorator(
  (data: keyof IUser, ctx: ExecutionContext) => {
    const request: IRequest = ctx.switchToHttp().getRequest();
    return data ? request.user[data as string] : request.user;
  },
);
