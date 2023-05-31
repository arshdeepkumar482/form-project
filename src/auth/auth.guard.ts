import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';
import { IJwtTokenPayload } from './auth.interface';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_COMPLETE_USER_DATA_REQUIRED = 'IS_COMPLETE_USER_DATA_REQUIRED';
export const CompleteUserData = () =>
  SetMetadata(IS_COMPLETE_USER_DATA_REQUIRED, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isCompleteUserDataRequired =
      this.reflector.getAllAndOverride<boolean>(
        IS_COMPLETE_USER_DATA_REQUIRED,
        [context.getHandler(), context.getClass()],
      );

    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (!token)
      throw new UnauthorizedException('Authorization Token is missing');

    try {
      const user: IJwtTokenPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_AUTH_SECRET,
      });

      if (isCompleteUserDataRequired) {
        request['user'] = await this.userService.getUserById(user._id);
      } else {
        request['user'] = user;
      }
    } catch (e) {
      throw new UnauthorizedException('Token Expired or not valid');
    }
    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split?.(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
